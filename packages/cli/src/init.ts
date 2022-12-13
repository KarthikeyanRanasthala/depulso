import fs from "fs";
import path from "path";

import { PROJECT_CONFIG_FILE_NAME } from "./constants";

export const onInit = () => {
  const config = {
    outputDirectory: "public",
  };

  fs.writeFileSync(
    path.join(process.cwd(), PROJECT_CONFIG_FILE_NAME),
    JSON.stringify(config, null, 2)
  );
};
