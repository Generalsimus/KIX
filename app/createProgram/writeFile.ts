import path from "path";
import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";

let inctermetner = 0
export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {
    console.log("🚀 --> file: writeFile.ts --> line 10 --> writeFile --> fileName", fileName, sourceFiles?.length)
    // throw new Error("ERRROOTTTT")
    const extName = path.extname(fileName);

    if (!sourceFiles) return;
    if (extName === ".js") {

        // console.log("🚀 --> file: watchFiles.ts --> line 6 --> inctermetner", fileName, inctermetner++);
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);
            console.log(App.moduleThree.keys(), sourceFile.fileName)
            if (!moduleInfo) continue;
            console.log("🚀 --> file: writeFile.ts --> line 22 --> writeFile --> moduleInfo", moduleInfo);
            if (moduleInfo.isNodeModule) {
                this.moduleRootWriter.writeJsCode(content);
                continue;
            }
            useRootWriterLoop(moduleInfo.rootWriters, (writer) => {
                writer.writeJsCode(content);
            });

            // console.log("🚀 --> file: writeFile.ts --> line 40 --> rootWritersLoop --> writer", writer.writeJsCode(content));
        }
    }
    // if (this.options.outDir) {
    //     fileName = path.join(App.runDirName, fileName);
    // }
}


const useRootWriterLoop = (rootWriters: ModuleInfoType["rootWriters"], writeCallback: (writer: rootWriter) => void) => {

    for (const mainFileName in rootWriters) {
        const writer = rootWriters[mainFileName];
        if (writer instanceof rootWriter) {
            writeCallback(writer);
        } else {
            useRootWriterLoop(writer, writeCallback);
        }
    }
}