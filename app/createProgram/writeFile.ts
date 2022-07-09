import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";


export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {

    if (!sourceFiles) return;
    if (/\.((jsx?)|(map)|(json))$/i.test(fileName)) {
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);


            if (!moduleInfo) continue;
            if (moduleInfo.isNodeModule) {
                this.moduleRootWriter.writeJsCode(sourceFile.fileName, content);
                continue;
            }

            useRootWriterLoop(moduleInfo.rootWriters, (writer) => {

                if (fileName.endsWith('.map')) {
                    writer.writeSourceMap(sourceFile.fileName, content);
                } else {
                    writer.writeJsCode(sourceFile.fileName, content);
                }
            });

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
