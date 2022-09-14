import { runDirectory } from "../app";
import { getPromptsQuestions } from "./getPromptsQuestions";
import path from "path";
import { copyFolderSync } from "../utils/copyFolderSync";
import { spawn, exec } from "child_process";
import consola from "consola";
import { clareLog } from "../utils/loger";
import { getInstallableVersions } from "./getInstallableVersions";

export const createTemplate = async () => {
    const { kixInstallVersion, typescriptInstallVersion } = await getInstallableVersions()
    const { appName, appCopyDirectory } = await getPromptsQuestions();
    // const toPath = path.join(runDirectory, appName);
    // const fromPath = appCopyDirectory;
    // copyFolderSync(fromPath, toPath, [], true);
    // const configToPath = path.join(fromPath, "../../config");
    // copyFolderSync(configToPath, toPath, [], true);

    // spawn('npm', ["install"], {
    //     shell: true,
    //     cwd: toPath,
    //     stdio: "inherit",
    // })
    //     .on("error", consola.error)
    //     .on("close", () => {
    //         clareLog({
    //             [`Project "${appName}" Created`]: "green",
    //             [`\nLocation: ` + toPath]: "white"
    //         })
    //     });;
};
