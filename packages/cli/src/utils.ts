import fs from "fs";
import path from "path";

import XDGAppPaths from "xdg-app-paths";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { APP_NAME } from "./constants";

export const getConfigDir = () => {
  const configDirs = XDGAppPaths(APP_NAME).dataDirs();

  return configDirs[0];
};

export const getUniqueName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    length: 3,
  });

export const getAllFiles = (dirPath: string, arrayOfFiles: string[]) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};
