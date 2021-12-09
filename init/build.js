import fs from "fs"
import path from "path";
import { copyFolderSync } from "../helpers/copyFolderSync";
import { App } from "./App";
import process from 'process';
import { safeFileWrite } from "../helpers/safeFileWrite";
import { clareLog } from "../helpers/loger";
import { minify } from "../helpers/minify";


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

        const ignorePaths = new Set()
        App.__requestsThreshold.forEach((fileContent, pathKey) => {
            const filePath = App.__IndexHTMLRequesPaths.includes(pathKey) ? "index.html" : pathKey
            const fileFullPath = path.join(buildFolderPath, filePath)
            if (ignorePaths.has(filePath)) {
                return;
            }
            if (path.extname(filePath) === ".js") {
                const mapValue = App.__requestsThreshold.get(filePath + ".map")
                const mapPath = fileFullPath + ".map"

                const minifed = minify(
                    String(fileContent),
                    mapValue
                )
                fileContent = minifed.code;
                ignorePaths.add(mapPath)
                if (minifed.map) {
                    const mapString = typeof minifed.map === "string" ? minifed.map : JSON.stringify(minifed.map);
                    safeFileWrite(mapPath, mapString)
                }

            }
            safeFileWrite(path.join(buildFolderPath, filePath), String(fileContent))
        }),

            clareLog({
                "\n√": "green",
                "Compiled successfully.": "white"
            })
    });

}