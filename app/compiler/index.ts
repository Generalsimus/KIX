import { getWriterProgram } from "./getWriterProgram"
import ts from "typescript";
import { App } from "../";

export const createCompiler = (program: ts.SemanticDiagnosticsBuilderProgram, rootNames: string[]) => {
    // console.log("🚀 --> file: index.ts --> line 6 --> createCompiler --> options", options);
    // export const createCompiler = (rootFilePaths: string[], watcherProgram: ts.WatchOfConfigFile<ts.SemanticDiagnosticsBuilderProgram>) => {
    // console.log(App.moduleThree.keys())
    // host.get
    // const moduleThree = App.moduleThree;
    // const program = 
    const writerProgram = getWriterProgram(program);

    // if (options.rootNames instanceof Array) {
    rootNames.forEach((rootFileName) => writerProgram.writeRootFile(rootFileName + ""))
    // }
    // getWriterProgram/
    // const maper: Record<string, Record<string, any>> = {}
    // const complier = createCompiler(program)

    // const compileLoop = (filePath: string) => {
    //     const moduleInfo = moduleThree.get(filePath)
    //     if (moduleInfo) {


    //         const sourceFile = program.getSourceFile(moduleInfo.modulePath.toLocaleLowerCase())

    //         //         if (sourceFile) {

    //         //             // const result = cachedWriterProgram.emit(
    //         //             //     sourceFile,
    //         //             //     (fileName: string, content: string) => {
    //         //             //         if (fileName.endsWith('.map')) {
    //         //             //             // maper[fileName] = JSON.parse(content)
    //         //             //         }
    //         //             //         else {

    //         //             //         }
    //         //             //     },
    //         //             //     undefined,
    //         //             //     undefined,
    //         //             //     {
    //         //             //         before: []
    //         //             //     },
    //         //             // )
    //         //             // const result = writerProgram.emit(
    //         //             //     sourceFile,
    //         //             //     (fileName: string, content: string) => {
    //         //             //         if (fileName.endsWith('.map')) {
    //         //             //             maper[fileName] = JSON.parse(content)
    //         //             //         }
    //         //             //         else {

    //         //             //         }
    //         //             //     },
    //         //             //     undefined,
    //         //             //     undefined,
    //         //             //     {
    //         //             //         before: []
    //         //             //     },
    //         //             // )
    //         //             // console.log("🚀 --> file: compileModules.ts --> line 32 --> compileLoop --> result", result);

    //         //         }
    //         //         compiler(moduleInfo.modulePath);
    //         //     }
    //         // }


    //         rootFilePaths.forEach(compileLoop)

    //     }
    // }
}







