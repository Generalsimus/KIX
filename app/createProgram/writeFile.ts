import path from "path";
import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";

let inctermetner = 0
export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {
    console.log("🚀 --> file: writeFile.ts --> line 10 --> writeFile --> fileName", fileName, sourceFiles?.length)

    // const extName = path.extname(fileName);

    if (!sourceFiles) return;
    if (/\.jsx?$/.test(fileName)) {
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);

            if (!moduleInfo) continue;
            if (moduleInfo.isNodeModule) {
                this.moduleRootWriter.writeJsCode(sourceFile.fileName, content);
                continue;
            }
            useRootWriterLoop(moduleInfo.rootWriters, (writer) => {

                console.log({ content })
                writer.writeJsCode(sourceFile.fileName, content);
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
            // console.log("🚀 --> file: writeFile.ts --> line 45 --> useRootWriterLoop --> writer", writer);
            useRootWriterLoop(writer, writeCallback);
        }
    }
}
