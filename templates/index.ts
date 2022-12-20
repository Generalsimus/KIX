import { getPromptsQuestions } from "./getPromptsQuestions";
import path from "path";
import { copyFolderSync } from "../utils/copyFolderSync";
import { spawn } from "child_process";
import { log } from "../utils/log";
import { writeFileSync } from "../utils/writeFileSync";
import { getPackageContents } from "./getConfigs/getPackageContents";
import { getTsconfigContent } from "./getConfigs/getTsconfigContent";
import { getWebpackConfigContents } from "./getConfigs/getWebpackConfigContents";
import { runDirectory } from "../app";
import color from "ansi-colors"

export const createTemplate = async (argvAppName: string | undefined) => {
    const { appName, path: appCopyDirectory, indexFile } = await getPromptsQuestions(argvAppName);

    const toPath = path.resolve(runDirectory, appName);
    const fromPath = appCopyDirectory;

    const configToPath = path.resolve(fromPath, "../../config");

    writeFileSync(path.resolve(toPath, "webpack.config.js"), getWebpackConfigContents(indexFile))
    writeFileSync(path.resolve(toPath, "tsconfig.json"), getTsconfigContent())
    writeFileSync(path.resolve(toPath, "package.json"), await getPackageContents())
    copyFolderSync(configToPath, toPath, [], true);
    copyFolderSync(fromPath, toPath, [], true);

    spawn('npm', ["install"], {
        shell: true,
        cwd: toPath,
        stdio: "inherit",
    })
        .on("error", log.error)
        .on("close", () => {
            log.clear()
            log.log(color.green(`Project "${appName}" Created`), `\nLocation: ` + toPath)
        });
};
