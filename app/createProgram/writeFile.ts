import path from "path";
import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { rootWriter } from "../rootWriter";

export function writeFile(this: createProgramHost, fileName: string, content: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) {
    console.log("🚀 --> file: writeFile.ts --> line 9 --> writeFile --> fileName", fileName);

    // const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(fileName);
    // console.log("🚀 --> file: writeFile.ts --> line 13 --> writeFile --> this.options", this.options);
    // throw new Error("STOPPPPPPPPPP")
    // console.log("🚀 --> file: writeFile.ts --> line 2 --> writeFile --> fileName", fileName);
    // console.log("🚀 --> file: writeFile.ts --> line 7 --> writeFile --> args", sourceFiles?.length);
    // console.log("🚀 --> file: writeFile.ts --> line 6 --> writeFile --> App.moduleThree", App.moduleThree.keys());
    const extName = path.extname(fileName);

    if (!sourceFiles) return;
    if (extName === ".js") {
        for (const sourceFile of sourceFiles) {
            const moduleInfo: ModuleInfoType | undefined = App.moduleThree.get(sourceFile.fileName);
            if (!moduleInfo) continue;
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
    // if(rootWriter)
    for (const mainFileName in rootWriters) {
        const writer = rootWriters[mainFileName];
        if (writer instanceof rootWriter) {
            writeCallback(writer);
        } else {
            useRootWriterLoop(writer, writeCallback);
        }
    }
}