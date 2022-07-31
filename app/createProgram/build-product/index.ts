import path from "path"
import fs from "fs"
import process from 'process';
import { minifyCode } from "./minify";
import { moveFileSync } from "../../../utils/moveFileSync";
import { copyFolderSync } from "../../../utils/copyFolderSync";
import { App } from "../..";
import { writeFileSync } from "../../../utils/writeFileSync";
import { createProgramHost } from "..";



export async function buildProduct(this: createProgramHost) {
    const runDirName = App.runDirName
    const fileName = path.basename(runDirName)
    const buildDirectory = path.resolve(runDirName, App.outDir)
    const outputDir = path.join(buildDirectory, fileName)


    if (fs.existsSync(outputDir)) {
        const cacheDir = path.join(buildDirectory, "versions", fileName + new Date().getTime())
        moveFileSync(outputDir, cacheDir);
    }

    copyFolderSync(runDirName, outputDir, [
        buildDirectory,
        path.join(App.runDirName, 'node_modules')
    ]);




    const ignoreUrlPaths = ["/"];

    for (const [fileUrlPath, getFileContent] of App.requestsThreshold.entries()) {


        if (!ignoreUrlPaths.includes(fileUrlPath) && !fileUrlPath.endsWith(".map")) {
            const { content, sourceMap } = await minifyCode(fileUrlPath, getFileContent(), this);

            const fileFullPath = path.join(outputDir, fileUrlPath);

            writeFileSync(fileFullPath, content)

            if (sourceMap && this.options.sourceMap) {
                console.log("🚀 --> file: index.ts --> line 40 --> buildProduct --> content", content.split("\n").pop());
                writeFileSync(fileFullPath + ".map", sourceMap)
            }
        }

    }


    process.exit(0)
}