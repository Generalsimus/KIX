import path from "path"
import { App } from ".."
import { copyFolderSync } from "../../utils/copyFolderSync"
import fs from "fs"
import { promisify } from "util"
import process from 'process';

export const buildProd = async () => {
    const runDirName = App.runDirName
    const fileName = path.basename(runDirName)
    const buildDirectory = path.resolve(runDirName, App.outDir)
    const outputDir = path.join(buildDirectory, fileName)
    const moveFile = promisify(fs.rename);
    if (fs.existsSync(outputDir)) {
        const cacheDir = path.join(buildDirectory, "oldVersions", new Date().getTime() + "")
        // console.log("🚀 --> file: index.ts --> line 15 --> buildProd --> outputDir", outputDir);
        // console.log("🚀 --> file: index.ts --> line 18 --> buildProd --> cacheDir", cacheDir);
        await moveFile(outputDir, cacheDir);
    }
    copyFolderSync(runDirName, outputDir, [buildDirectory])
    // process.exit(0)
}