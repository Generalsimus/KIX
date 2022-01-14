import ts from "typescript";
import { App } from "../";
import { ModuleInfoType } from "../../utils/createModuleInfo";
import { getRootWriter } from "./getRootWriter";

// let cachedWriterProgram: ts.Program | undefined;
export type RootWriterCacheType = ReturnType<typeof getRootWriter>

export const getWriterProgram = (program: ts.SemanticDiagnosticsBuilderProgram) => {

    // program.tra
    const WriterProgram = ts.createProgram([], {
        ...program.getCompilerOptions(),
        rootNames: [],
        sourceMap: true,
        // inlineSourceMap: true,
        listEmittedFiles: true,
        noEmit: false,
    })

    return {
        program,
        rootWritersCache: {} as Record<string, RootWriterCacheType>,
        writeRootFile(rootFileName: string) {
            const writerObject = (this.rootWritersCache[rootFileName] = (this.rootWritersCache[rootFileName] || getRootWriter(rootFileName, WriterProgram)))
            // console.log(this)
            const moduleInfo = App.moduleThree.get(rootFileName)
            console.log("🚀 --> file: getWriterProgram.ts --> line 28 --> writeRootFile -->  App.moduleThree", App.moduleThree.keys());
            console.log("🚀 --> file: getWriterProgram.ts --> line 28 --> writeRootFile --> rootFileName", rootFileName);
            if (!moduleInfo) {
                throw new Error(`moduleInfo not found for ${rootFileName}`)
            }
            this.createRootFileModulesWriterLoop(moduleInfo, writerObject)
            // getRootWriter
            // getRootWriter

        },
        createRootFileModulesWriterLoop(rootModuleInfo: ModuleInfoType, writerObject: RootWriterCacheType) {
            rootModuleInfo.writers[writerObject.rootFileName] = writerObject;
            const sourceFile = this.program.getProgram().getSourceFile(rootModuleInfo.modulePath)

            if (!sourceFile) return;

            writerObject.writeSourceFile(sourceFile)

            for (const moduleImportPathKey in rootModuleInfo.moduleCollection) {
                const childModuleInfo = rootModuleInfo.moduleCollection[moduleImportPathKey];
                if (!childModuleInfo) return

                this.createRootFileModulesWriterLoop(childModuleInfo, writerObject)
            }
        }
    }
}