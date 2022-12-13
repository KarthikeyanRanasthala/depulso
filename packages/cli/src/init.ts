import fs from "fs";
import path from "path";

import { PROJECT_CONFIG_FILE_NAME } from "./constants";

export const onInit = () => {
  const config = {
    outputDirectory: "build",
  };

  fs.writeFileSync(
    path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
    JSON.stringify(config, null, 2)
  );
};
