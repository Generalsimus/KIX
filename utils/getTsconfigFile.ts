import ts from "typescript";
import path from "path";
import { App } from "../app";
import { existsSync } from "fs";

export const getTsconfigFilePath = (): string => {
  const configPath =
    ts.findConfigFile(
      /*searchPath*/ App.runDirName,
      ts.sys.fileExists,
      "tsconfig.json"
    ) || path.join(__dirname, "../../demoTemplates/TS/tsconfig.json")

  if (!existsSync(configPath)) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  return configPath;
};
