import fs from "fs";
import path from "path";
import { AUTH_CONFIG_FILE_NAME } from "../constants";

import { getConfigDir } from "../utils";

export const onLogout = () => {
  const configDir = getConfigDir();

  const filePath = path.join(configDir, AUTH_CONFIG_FILE_NAME);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  console.log("Logged out successfully :(");
};
