import ts from "typescript";
import path from "path";
import fs from "fs";
import { App } from "../app";
import { getTsconfigFilePath } from "./getTsconfigFile";

export const readTsConfigFile = (): Record<string, any> => {
    const configFilePath = getTsconfigFilePath();
    return ts.parseConfigFileTextToJson(configFilePath, fs.readFileSync(configFilePath, "utf8")).config
}