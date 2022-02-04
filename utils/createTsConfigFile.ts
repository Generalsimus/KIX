import ts from "typescript";
import { App } from "../app";
import fs from "fs";

export const createTsConfigFile = () => {
    const configFileName = ts.findConfigFile(
        App.runDirName,
        (fileName: string) => {
            return fs.existsSync(fileName);
        },
        "tsconfig.json"
    );

    if (!configFileName) {
        throw console.error(new Error(`Could not find tsconfig.json at ${configFileName}`));
    }

    return configFileName
}