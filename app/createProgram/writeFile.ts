import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";


export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {
// console.log("🚀 --> file: writeFile.ts --> line 9 --> writeFile --> content", content);
// console.log("🚀 --> file: writeFile.ts --> line 9 --> writeFile --> fileName", fileName);


    if (!sourceFiles) return;
    if (/\.((jsx?)|(map))$/.test(fileName)) {
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);


            if (!moduleInfo) continue;
            if (moduleInfo.isNodeModule) {
                this.moduleRootWriter.writeJsCode(sourceFile.fileName, content);
                continue;
            }
            useRootWriterLoop(moduleInfo.rootWriters, (writer) => {

                // console.log({ content }) 
                if (fileName.endsWith('.map')) {
                    writer.writeSourceMap(sourceFile.fileName, content);
                } else {
                    writer.writeJsCode(sourceFile.fileName, content);
                }
            });

        }
    }

}


const useRootWriterLoop = (rootWriters: ModuleInfoType["rootWriters"], writeCallback: (writer: rootWriter) => void) => {

    for (const mainFileName in rootWriters) {
        const writer = rootWriters[mainFileName];
        if (rootWriters === writer) continue;
        if (writer instanceof rootWriter) {
            writeCallback(writer);
        } else {
            useRootWriterLoop(writer, writeCallback);
        }
    }
}
