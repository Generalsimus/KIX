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

    copyFolderSync(runDirName, outputDir, [
        buildDirectory,
        path.join(App.runDirName, 'node_modules')
    ]);




    const ignoreUrlPaths = ["/"];

    // console.log("🚀 --> file: index.ts --> line 35 --> buildProd --> fileUrlPath", App.requestsThreshold.keys());
    for (const [fileUrlPath, getFileContent] of App.requestsThreshold.entries()) {
        // console.log("🚀 --> file: index.ts --> line 36 --> buildProd --> fileUrlPath",
        //     fileUrlPath,
        //     !ignoreUrlPaths.includes(fileUrlPath) && !fileUrlPath.endsWith(".map")
        // );

        if (!ignoreUrlPaths.includes(fileUrlPath) && !fileUrlPath.endsWith(".map")) {
            const { content, sourceMap } = await minifyCode(fileUrlPath, getFileContent());
            // console.log("🚀 --> file: index.ts --> line 42 --> buildProd --> fileUrlPath", {
            //     fileUrlPath,
            //     sourceMap: sourceMap?.length,
            // });
            const fileFullPath = path.join(outputDir, fileUrlPath);

            writeFileSync(fileFullPath, content)

            if (sourceMap) {
                writeFileSync(fileFullPath + ".map", sourceMap)
            }
        }

    }


    process.exit(0)
}