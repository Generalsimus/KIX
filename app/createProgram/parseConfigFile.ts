import { createProgramHost } from ".";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { parseJsonFile } from "../../utils/parseJson";
import fs from "fs"

export const parseConfigFile = (programHost: createProgramHost) => {
    const defaultOptions = { ...programHost.options };

    const readConfigFile = () => {
        const configFilePath = getTsconfigFilePath();
        if (!fs.existsSync(configFilePath)) {
            console.error(new Error(`Could not find tsconfig.json at ${configFilePath}`));
        }

        const tsConfigs = parseJsonFile(configFilePath);
        if (tsConfigs.error) {
            programHost.configFileParsingDiagnostics = [tsConfigs.error]
        }
        if (tsConfigs.config?.compilerOptions instanceof Object) {
            programHost.options = { ...defaultOptions, ...tsConfigs.config.compilerOptions };
        }
    }

    programHost.watcher.on('all', readConfigFile)
    readConfigFile()
}

