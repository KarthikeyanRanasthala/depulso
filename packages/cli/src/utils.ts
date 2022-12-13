import XDGAppPaths from "xdg-app-paths";

import { APP_NAME } from "./constants";

export const getConfigDir = () => {
  const configDirs = XDGAppPaths(APP_NAME).dataDirs();

  return configDirs[0];
};
