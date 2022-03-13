import { createProgramHost } from ".";
import { App } from "..";
import ts, { getDefaultLibFileName } from "typescript";
import { deepAssign } from "../../utils/deepAssign";
import { readTsConfigFile } from "../../utils/readTsConfigFile";

export const useConfigFileParser = (host: createProgramHost) => {
    const requiredOptions = {
        ...host.options
    };
    let diagnostics: ts.Diagnostic[] = []

    const onConfigFileChange = () => {
        diagnostics.forEach(diagnostic => host.configFileParsingDiagnostics.delete(diagnostic));
        diagnostics = [];

        const configFile = readTsConfigFile()
        const { options, errors } = configFile


        diagnostics.push(...errors)
        const compilerOptions = deepAssign({}, options, requiredOptions)
        if (!options.lib && requiredOptions.lib) {
            compilerOptions.lib = [...requiredOptions.lib, getDefaultLibFileName(compilerOptions)]
        }

        host.options = compilerOptions;
        // console.log("🚀 --> file: useConfigFileParser.ts --> line 28 --> onConfigFileChange --> host.options", host.options);
        

        return configFile
    }
    const { configFileName } = onConfigFileChange()

    host.watcher.createWatcher({
        event: "all",
        filePath: configFileName,
        callBack: onConfigFileChange
    })
}

