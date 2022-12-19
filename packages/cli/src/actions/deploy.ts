import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import mime from "mime";

import { getProjectConfig, getRemoteConfig, getSavedTokens } from "../service";
import { getSupabaseClient } from "../supabase";
import { getAllFiles } from "../utils";
import { onInit, onPromptForLogin } from "./init";

export const onDeploy = async () => {
  const projectConfig = getProjectConfig();

  if (
    !projectConfig ||
    !projectConfig?.outputDirectory ||
    !projectConfig?.outputDirectory
  ) {
    const { shouldInit } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldInit",
        message:
          "Looks like the project is not initialized, let's inititalize?",
        default: true,
      },
    ]);

    if (shouldInit) {
      await onInit();
      return;
    }
  }

  const tokens = getSavedTokens();

  if (tokens) {
    const client = await getSupabaseClient();
    const config = await getRemoteConfig();

    const { error } = await client.auth.setSession(tokens);

    if (error) {
      await onPromptForLogin();
      return;
    }

    const files = getAllFiles(path.join(projectConfig?.outputDirectory), []);

    const deploymentSize = files.reduce((acc, curr) => acc + curr.size, 0);

    if (deploymentSize > config?.maxDeploymentSize) {
      ora({
        text: `Deployment failed, size of the '${projectConfig?.outputDirectory}' directory is more than 10MB`,
      }).fail();

      return;
    }

    const fileNames = getAllFiles(
      path.join(projectConfig?.outputDirectory),
      []
    ).map((el) => el.name.split(projectConfig?.outputDirectory)[1]);

    const uploadProgress = ora({
      spinner: "material",
      text: "Uploading...",
    }).start();

    for (let i = 0; i < fileNames.length; i++) {
      uploadProgress.text = `Uploading (${i + 1}/${fileNames.length}) - ${
        fileNames[i]
      }`;

      const fileContent = fs.readFileSync(
        path.join(projectConfig?.outputDirectory, fileNames[i])
      );

      const contentType = mime.getType(fileNames[i]);

      const { error } = await client.storage
        .from("deployments")
        .upload(`${projectConfig?.project}${fileNames[i]}`, fileContent, {
          upsert: true,
          ...(contentType
            ? {
                contentType,
                ...(contentType === "text/html" ? { cacheControl: "0" } : {}),
              }
            : {}),
        });

      if (error) {
        uploadProgress.fail(`Deployment failed - ${error?.message}`);
        break;
      }
    }

    uploadProgress.succeed(
      `Deployment successful, https://${projectConfig?.project}.depulso.site`
    );
  } else {
    await onPromptForLogin();
    return;
  }
};
