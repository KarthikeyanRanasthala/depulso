import path from "path";
import fs from "fs";

import axios from "axios";
import { getConfigDir } from "./utils";
import { AUTH_CONFIG_FILE_NAME, PROJECT_CONFIG_FILE_NAME } from "./constants";

export const getRemoteConfig = () =>
  axios.get<{
    supabaseURL: string;
    supabaseAnonKey: string;
    maxDeploymentSize: number;
  }>("http://localhost:1234/config");

export const getSavedTokens = () => {
  const configDir = getConfigDir();
  const authConfigFilePath = path.join(configDir, AUTH_CONFIG_FILE_NAME);

  if (fs.existsSync(authConfigFilePath)) {
    const { accessToken, refreshToken } = JSON.parse(
      fs.readFileSync(authConfigFilePath).toString()
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  return null;
};

export const getProjectConfig = () => {
  const projectConfigFilePath = path.join(
    process.cwd(),
    PROJECT_CONFIG_FILE_NAME
  );

  if (fs.existsSync(projectConfigFilePath)) {
    let { outputDirectory, project } = JSON.parse(
      fs.readFileSync(projectConfigFilePath).toString()
    );

    return { outputDirectory, project };
  }

  return null;
};
