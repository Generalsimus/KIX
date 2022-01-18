import { createProgramHost } from ".";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { parseJsonFile } from "../../utils/parseJson";
import fs from "fs"
import { App } from "..";
import ts from "typescript";
import { deepAssign } from "../../utils/deepAssign";

export const createConfigFileParser = (programHost: createProgramHost) => {
    const defaultOptions = { ...programHost.options };
    let diagnostics: ts.Diagnostic[] = []
    const configFileName = ts.findConfigFile(
        App.runDirName,
        ts.sys.fileExists,
        "tsconfig.json"
    );
    if (!configFileName) {
        throw console.error(new Error(`Could not find tsconfig.json at ${configFileName}`));
    }
    const onConfigFileChange = () => {
        diagnostics.forEach(diagnostic => programHost.configFileParsingDiagnostics.delete(diagnostic));
        diagnostics = [];


        const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
        configFile.error && diagnostics.push(configFile.error)

        const compilerOptions = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            "./"
        );
        diagnostics.push(...compilerOptions.errors)

        if (compilerOptions.options) {
            programHost.options = deepAssign(defaultOptions, compilerOptions.options);
        }
        return programHost
    }
    onConfigFileChange()
    return { onConfigFileChange, configFileName }
}

