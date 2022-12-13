import fs from "fs";
import path from "path";
import { AUTH_CONFIG_FILE_NAME } from "./constants";

import { getConfigDir } from "./utils";

export const onLogout = () => {
  const configDir = getConfigDir();

  fs.unlinkSync(path.join(configDir, AUTH_CONFIG_FILE_NAME));
};
