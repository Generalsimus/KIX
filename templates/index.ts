import { getPromptsQuestions } from "./getPromptsQuestions";
import path from "path";
import { copyFolderSync } from "../utils/copyFolderSync";
import { spawn } from "child_process";
import consola from "consola";
import { clareLog } from "../utils/loger";
import { writeFileSync } from "../utils/writeFileSync";
import { getPackageContents } from "./getConfigs/getPackageContents";
import { getTsconfigContent } from "./getConfigs/getTsconfigContent";
import { getWebpackConfigContents } from "./getConfigs/getWebpackConfigContents";
import currentPackage from "../package.json"
import { runDirectory } from "../app";


export const createTemplate = async () => {
    const { appName, path: appCopyDirectory, indexFile } = await getPromptsQuestions();
    const toPath = path.resolve(runDirectory, appName);
    const fromPath = appCopyDirectory;


    const configToPath =path.resolve(fromPath, "../../config");

    writeFileSync(path.resolve(toPath, "webpack.config.js"), getWebpackConfigContents(indexFile))
    writeFileSync(path.resolve(toPath, "tsconfig.json"), getTsconfigContent())
    writeFileSync(path.resolve(toPath, "package.json"), getPackageContents(currentPackage.version, currentPackage.dependencies.typescript))
    copyFolderSync(configToPath, toPath, [], true);
    copyFolderSync(fromPath, toPath, [], true);

    spawn('npm', ["install"], {
        shell: true,
        cwd: toPath,
        stdio: "inherit",
    })
        .on("error", consola.error)
        .on("close", () => {
            clareLog({
                [`Project "${appName}" Created`]: "green",
                [`\nLocation: ` + toPath]: "white"
            })
        });
};
