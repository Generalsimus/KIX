import { createProgramHost } from ".";
import { App } from "..";
import ts from "typescript";
import { deepAssign } from "../../utils/deepAssign";
import { readTsConfigFile } from "../../utils/readTsConfigFile";

export const useConfigFileParser = (programHost: createProgramHost) => {
    const requiredOptions = {
        ...programHost.options
    };
    let diagnostics: ts.Diagnostic[] = []

    const onConfigFileChange = () => {
        diagnostics.forEach(diagnostic => programHost.configFileParsingDiagnostics.delete(diagnostic));
        diagnostics = [];

        const configFile = readTsConfigFile()
        const { options, errors } = configFile


        diagnostics.push(...errors)
        programHost.options = deepAssign(options, requiredOptions);
        return configFile
    }
    const { configFileName } = onConfigFileChange()

    programHost.watcher.createWatcher({
        event: "all",
        filePath: configFileName,
        callBack: onConfigFileChange
    })
}

