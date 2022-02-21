import path from "path"
import { App } from ".."
// import { copyFolderSync } from "../../utils/copyFolderSync"
import fs from "fs"
import process from 'process';
import { copyFolderSync } from "../../utils/copyFolderSync";
import { moveFileSync } from "../../utils/moveFileSync";
import { writeFileSync } from "../../utils/writeFileSync";

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
    const ignoreUrlPaths = ["/"]
    App.requestsThreshold.forEach((getFileContent, fileUrlPath) => {
        if (!ignoreUrlPaths.includes(fileUrlPath)) {
            writeFileSync(path.join(outputDir, fileUrlPath), getFileContent())
        }

    })
    console.log("🚀 --> file: index.ts --> line 27 --> App.requestsThreshold.forEach --> App.requestsThreshold", App.requestsThreshold);
    process.exit(0)
}