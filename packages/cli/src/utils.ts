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

export const getAllFiles = (
  dirPath: string,
  arrayOfFiles: { name: string; size: number }[]
) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const stat = fs.statSync(dirPath + "/" + file);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push({
        name: path.join(dirPath, "/", file),
        size: stat.size / (1024 * 1024),
      });
    }
  });

  return arrayOfFiles;
};

export const isNextJS = (framework: { id: string }) => framework.id === "next";
