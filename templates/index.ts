import { ModuleBuilder, TemplateTypes, getPromptsQuestions } from "./getPromptsQuestions";
import path from "path";
import { copyFolderSync } from "../utils/copyFolderSync";
import { spawn } from "child_process";
import { log } from "../utils/log";
import { writeFileSync } from "../utils/writeFileSync";
import { appDirectory, runDirectory } from "../app";
import { toRgb } from "colby/toRgb";
import { getVitePackageConfig } from "./vite/getVitePackageConfig";
import { getViteDefaultConfig } from "./vite/getViteDefaultConfig";
import { getViteIndexHTML } from "./vite/getViteIndexHTML";
import { getWebPackIndexHTML } from "./webpack/getWebPackIndexHTML";
import { getWebpackPackageConfig } from "./webpack/getWebpackPackageConfig";
import { getWebpackDefaultConfig } from "./webpack/getWebpackDefaultConfig";
import { getMainFileCode } from "./getMainFileCode";
import { getWebpackTsConfig } from "./webpack/getWebpackTsConfig";
import { getVitTsConfig } from "./vite/getViteTsConfig";
import packageConfig from "../package.json"

export const createTemplate = async (argvAppName: string | undefined) => {
    const { version: kixVersion, dependencies: { typescript: typescriptVersion } } = packageConfig
    const { appName, templateType, moduleBuilder } = await getPromptsQuestions(argvAppName);

    const toPath = path.resolve(runDirectory, appName);
    const fromPath = path.resolve(path.join(appDirectory, "templates", "config"));

    copyFolderSync(fromPath, toPath, [], true);


    const packageJsonPath = path.resolve(toPath, "package.json");
    const fileExt = (templateType === TemplateTypes.JS ? "js" : "ts");
    const mainFileName = ("./src/index." + fileExt + "x");
    if (moduleBuilder === ModuleBuilder.WEBPACK) {
        writeFileSync(packageJsonPath, JSON.stringify(getWebpackPackageConfig(kixVersion, typescriptVersion, appName), null, 4));
        const webpackConfigPath = path.resolve(path.join(toPath, "webpack.config.js"));
        writeFileSync(webpackConfigPath, getWebpackDefaultConfig(mainFileName));
        writeFileSync(path.resolve(path.join(toPath, "index.html")), getWebPackIndexHTML());
        writeFileSync(path.resolve(path.join(toPath, "tsconfig.json")), JSON.stringify(getWebpackTsConfig(), null, 4));

    } else if (moduleBuilder === ModuleBuilder.VITE) {
        writeFileSync(packageJsonPath, JSON.stringify(getVitePackageConfig(kixVersion, typescriptVersion, appName), null, 4));
        const viteConfigPath = path.resolve(path.join(toPath, "vite.config." + fileExt));
        writeFileSync(viteConfigPath, getViteDefaultConfig());
        writeFileSync(path.resolve(path.join(toPath, "index.html")), getViteIndexHTML(mainFileName));
        writeFileSync(path.resolve(path.join(toPath, "tsconfig.json")), JSON.stringify(getVitTsConfig(), null, 4));

    }
   
    const executeMainFilePath = path.resolve(path.join(toPath, mainFileName));
    writeFileSync(executeMainFilePath, getMainFileCode());

    spawn('npm', ["install"], {
        shell: true,
        cwd: toPath,
        stdio: "inherit",
    })
        .on("error", log.error)
        .on("close", () => {
            log.clear()
            log.log(toRgb(0, 128, 0)(`Project "${appName}" Created`), `\nLocation: ` + toPath);
        });
};
