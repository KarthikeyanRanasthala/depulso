import fs from "fs";
import path from "path";

import { AUTH_CONFIG_FILE_NAME, PROJECT_CONFIG_FILE_NAME } from "./constants";
import { getAllFiles, getConfigDir, getUniqueName } from "./utils";
import { client } from "./supabase";
import mime from "mime";

export const onDeploy = async () => {
  const configDir = getConfigDir();

  const authConfigFilePath = path.join(configDir, AUTH_CONFIG_FILE_NAME);

  if (fs.existsSync(authConfigFilePath)) {
    const { accessToken, refreshToken } = JSON.parse(
      fs.readFileSync(authConfigFilePath).toString()
    );

    const authResponse = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (authResponse.error) {
      console.log(authResponse.error);

      process.exit(1);
    }

    const projectConfigFilePath = path.join(
      process.cwd(),
      PROJECT_CONFIG_FILE_NAME
    );

    console.log({ projectConfigFilePath });

    if (fs.existsSync(projectConfigFilePath)) {
      let { outputDirectory, project } = JSON.parse(
        fs.readFileSync(projectConfigFilePath).toString()
      );

      if (!project) {
        project = getUniqueName();

        fs.writeFileSync(
          path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
          JSON.stringify({ project, outputDirectory }, null, 2)
        );
      }

      // Check the files in outputDirectory
      // Max file size - 1MB
      // Max files - 25?

      const files = getAllFiles(path.join(outputDirectory), []).map(
        (el) => el.split(outputDirectory)[1]
      );

      for (let i = 0; i < files.length; i++) {
        console.log(path.join(outputDirectory, files[i]));
        const fileContent = fs.readFileSync(
          path.join(outputDirectory, files[i])
        );

        const contentType = mime.getType(files[i]);

        console.log({ contentType }, files[i]);

        const { error } = await client.storage
          .from("deployments")
          .upload(
            `${project}${files[i]}`,
            fileContent,
            contentType ? { contentType, upsert: true } : { upsert: true }
          );

        if (error) {
          console.log(error);

          process.exit(1);
        }
      }
    } else {
      console.log("No Project Init");

      process.exit(1);
    }
  } else {
    console.log("Not logged in!");
  }
};
