import fs from "fs";
import path from "path";
import {
  listFrameworks,
  // @ts-ignore
} from "@netlify/framework-info";

import { PROJECT_CONFIG_FILE_NAME } from "./constants";

const isNextJS = (framework: { id: string }) => framework.id === "next";

export const onInit = async () => {
  const detectedFrameworks = await listFrameworks({
    projectDir: process.cwd(),
  });

  const config = {
    outputDirectory: detectedFrameworks.length
      ? isNextJS(detectedFrameworks[0])
        ? "out"
        : detectedFrameworks[0]?.build?.directory || "build"
      : "build",
  };

  fs.writeFileSync(
    path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
    JSON.stringify(config, null, 2)
  );
};
