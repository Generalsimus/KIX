import path from "path"
import { App } from ".."
// import { copyFolderSync } from "../../utils/copyFolderSync"
import fs from "fs"
import process from 'process';
import { copyFolderSync } from "../../utils/copyFolderSync";
import { moveFileSync } from "../../utils/moveFileSync";
import { writeFileSync } from "../../utils/writeFileSync";
import { minifyCode } from "./minify";

export const buildProd = async () => {
    const runDirName = App.runDirName
    const fileName = path.basename(runDirName)
    const buildDirectory = path.resolve(runDirName, App.outDir)
    const outputDir = path.join(buildDirectory, fileName)


    if (fs.existsSync(outputDir)) {
        const cacheDir = path.join(buildDirectory, "versions", fileName + new Date().getTime())
        moveFileSync(outputDir, cacheDir);
    }

    copyFolderSync(runDirName, outputDir, [buildDirectory]);


    console.log("🚀 --> file: index.ts --> line 34 --> App.requestsThreshold.forEach --> App.requestsThreshold", App.requestsThreshold);

    const ignoreUrlPaths = ["/"]
    App.requestsThreshold.forEach((getFileContent, fileUrlPath) => {
        if (!ignoreUrlPaths.includes(fileUrlPath) && !fileUrlPath.endsWith(".map")) {
            const { content, sourceMap } = minifyCode(fileUrlPath, getFileContent());
            const fileFullPath = path.join(outputDir, fileUrlPath)
            // console.log("🚀 --> file: index.ts --> line 32 --> App.requestsThreshold.forEach --> content", content);
            writeFileSync(fileFullPath, content)
            if (sourceMap) {
                writeFileSync(fileFullPath + ".map", sourceMap)
            }
        }

    })

    process.exit(0)
}