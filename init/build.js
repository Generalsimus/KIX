import fs from "fs"
import path from "path";
import { copyFolderSync } from "../Helpers/copyFolderSync";
import { App } from "./App";
import process from 'process';
import { safeFileWrite } from "../Helpers/safeFileWrite";
import { clareLog } from "../Helpers/loger";


export const buildApp = () => {
    const { __compiledFilesThreshold } = require("./Compiler/CompileFile");
    const buildFolderPath = path.join(App.__RunDirName, App.__compilerOptions.outDir);
    process.on('exit', () => {
        fs.rmSync(buildFolderPath, { recursive: true, force: true });

        copyFolderSync(App.__RunDirName, buildFolderPath, [
            buildFolderPath,
            path.join(App.__RunDirName, "node_modules"),
            ...(Array.from(__compiledFilesThreshold, ([_, program]) => {
                return program.getSourceFiles().map(file => path.resolve(file.originalFileName))
            }).flat(Infinity))
        ]);

        App.__requestsThreshold.forEach((fileContent, pathKey) => {
            const filePath = App.__IndexHTMLRequesPaths.includes(pathKey) ? "index.html" : pathKey
            safeFileWrite(path.join(buildFolderPath, "zzsdsds/sadasd/s", filePath), String(fileContent))
        }),

            clareLog({
                "\n√": "green",
                "Compiled successfully.": "green"
            })
    });

}