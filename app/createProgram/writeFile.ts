import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType, rootWritersType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";
import fs from "fs"
import path from "path";
import { normalizeSlashes } from "../../utils/normalizeSlashes";


export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {

    if (!sourceFiles) return;
    if (/\.((jsx?)|(map))$/.test(fileName)) {
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);


            if (!moduleInfo) continue;
            if (moduleInfo.isNodeModule) {
                this.moduleRootWriter.writeJsCode(sourceFile.fileName, content);
                continue;
            }
            // console.log("🚀 --> file: --> moduleInfo.rootWriters", fileName, moduleInfo.rootWriters);
            useRootWriterLoop(moduleInfo.rootWriters, (writer) => {

                if (fileName.endsWith('.map')) {
                    writer.writeSourceMap(sourceFile.fileName, content);
                } else {
                    // console.log("🚀 --> file: writeFile.ts --> line 9 --> writeFile --> content", content);
                    writer.writeJsCode(sourceFile.fileName, content);
                }
            }
                // , [moduleInfo.modulePath]
            );

        }
    }

}



const useRootWriterLoop = (
    rootWriters: ModuleInfoType["rootWriters"],
    writeCallback: (writer: rootWriter) => void,
    parentModulePath: string = "",
    pathCache = new Set<string>()
) => {

    for (const mainFileName in rootWriters) {
        const writer = rootWriters[mainFileName];
        const accessKey = parentModulePath + mainFileName;

        if (rootWriters === writer || pathCache.has(accessKey)) continue;
        pathCache.add(accessKey)
        if (writer instanceof rootWriter) {
            writeCallback(writer);
        } else {
            useRootWriterLoop(writer, writeCallback, mainFileName, pathCache);
        }
    }
}
