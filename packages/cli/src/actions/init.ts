import fs from "fs";
import path from "path";
import axios, { isAxiosError } from "axios";
import ora from "ora";

import {
  listFrameworks,
  // @ts-ignore
} from "@netlify/framework-info";
import inquirer from "inquirer";
import { isNextJS } from "../utils";
import { PROJECT_CONFIG_FILE_NAME } from "../constants";
import { getProjectConfig, getSavedTokens } from "../service";
import { onLogin } from "./login";
import { getSupabaseClient } from "../supabase";

export const onPromptForLogin = async () => {
  const { shouldLogin } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldLogin",
      message: "You don't seem to be logged in, let's login?",
      default: true,
    },
  ]);

  if (shouldLogin) {
    await onLogin();
  }
};

export const onInit = async () => {
  const projectConfig = getProjectConfig();

  if (projectConfig?.outputDirectory && projectConfig?.project) {
    console.log(
      `Project already initialized, check ${PROJECT_CONFIG_FILE_NAME}`
    );
    return;
  }

  const detectedFrameworks = await listFrameworks({
    projectDir: process.cwd(),
  });

  let outputDirectory = null;

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "outputDirectory",
        message: `Build output directory${
          detectedFrameworks.length
            ? `(auto-detected ${detectedFrameworks[0].name} app)`
            : ""
        }`,
        default: detectedFrameworks.length
          ? isNextJS(detectedFrameworks[0])
            ? "out"
            : detectedFrameworks[0].build.directory
          : "build",
      },
    ]);

    outputDirectory = answers.outputDirectory;

    fs.writeFileSync(
      path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
      JSON.stringify({ outputDirectory }, null, 2)
    );

    const tokens = getSavedTokens();

    if (tokens) {
      const client = await getSupabaseClient();

      const {
        error,
        data: { session },
      } = await client.auth.setSession(tokens);

      if (error) {
        await onPromptForLogin();
        return;
      }

      const loadingSuggestion = ora({
        text: "Loading suggestion",
        spinner: "clock",
      }).start();

      let data = null;

      try {
        const response = await axios.get<{ suggestion: string }>(
          "https://api.depulso.co/projects/suggestion",
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        data = response.data;

        loadingSuggestion.stop();
      } catch (error) {
        if (isAxiosError(error)) {
          loadingSuggestion.fail(
            error?.response?.data?.message || error?.message
          );
          return;
        }

        loadingSuggestion.fail();
        return;
      }

      const creatingProject = ora({
        text: "Creating project",
        spinner: "earth",
      });

      try {
        const { project } = await inquirer.prompt([
          {
            type: "input",
            name: "project",
            message: "Project name",
            default: data?.suggestion,
          },
        ]);

        creatingProject.start();

        await axios.post(
          "https://api.depulso.co/projects",
          {
            name: project,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        fs.writeFileSync(
          path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
          JSON.stringify({ outputDirectory, project }, null, 2)
        );

        creatingProject.succeed("Project created successfully");
      } catch (error) {
        if (isAxiosError(error)) {
          creatingProject.fail(
            error?.response?.data?.message || error?.message
          );
          return;
        }

        creatingProject.fail();
        return;
      }
    } else {
      await onPromptForLogin();
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
