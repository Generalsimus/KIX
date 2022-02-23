import ts, { ParsedCommandLine } from "typescript";
import path from "path";
import fs from "fs";
import { App } from "../app";
import { createTsConfigFile } from "./createTsConfigFile";


export const readTsConfigFile = (): {
    configFileName: string,
    options: ts.CompilerOptions,
    errors: ts.Diagnostic[]
} => {
    const file = "tsconfig.json"
    let configFileName = ts.findConfigFile(
        App.runDirName,
        (fileName: string) => {
            return fs.existsSync(fileName);
        },
        file
    );

    if (!configFileName) {
        return {
            configFileName: path.join(App.runDirName, file),
            options: defaultCompilerOptions,
            errors: []
        }
    }

    const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
    const compilerOptions = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        "./"
    );

    return {
        configFileName,
        options: compilerOptions.options,
        errors: [...compilerOptions.errors, ...(configFile.error, [])]
    }
}

const defaultCompilerOptions = {
    "skipLibCheck": true,
    "sourceMap": true,
}