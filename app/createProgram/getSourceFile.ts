import fs from "fs"
import ts from "typescript"
import { createProgramHost } from "."
import { App } from ".." 
import { newSourceFilesPathSet } from "./readFile"

export function getSourceFile(this: createProgramHost, fileName: string, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined): ts.SourceFile {
    var text;
    try {

        text = this.readFile(fileName);

    }
    catch (e: any) {
        if (onError) {
            onError(e.message);
        }
        text = "";
    }

    return ts.createSourceFile(fileName, this.readFile(fileName) || "", languageVersion, true);
}

// function getSourceFile(fileName, languageVersion, onError) {
//     var text;
//     try {
//         ts.performance.mark("beforeIORead");
//         text = compilerHost.readFile(fileName);
//         ts.performance.mark("afterIORead");
//         ts.performance.measure("I/O Read", "beforeIORead", "afterIORead");
//     }
//     catch (e) {
//         if (onError) {
//             onError(e.message);
//         }
//         text = "";
//     }
//     return text !== undefined ? ts.createSourceFile(fileName, text, languageVersion, setParentNodes) : undefined;
// }
// type GetSourceFileType = ts.CompilerHost["getSourceFile"]

// let realGetSourceFile: GetSourceFileType = () => {
//     throw Error("getSourceFile is not implemented")
// }

// // const writer =
// // const testMap = new Map()
// export const createGetSourceFile = (host: ts.CompilerHost, options: ts.CompilerOptions | undefined) => {
//     // .getSourceFile
//     // program: ts.SemanticDiagnosticsBuilderProgram
//     realGetSourceFile = host.getSourceFile
//     // host.
//     // getCustomTransformers
//     if (!options) {
//         throw new Error("CompilerOptions is undefined")

//     }
//     //

//     return getSourceFile
// }






// // newSourceFilesSet





// export function getSourceFile(
//     fileName: string,
//     languageVersion: ts.ScriptTarget,
//     onError?: ((message: string) => void) | undefined,
//     shouldCreateNewSourceFile?: boolean | undefined
// ): ts.SourceFile | undefined {
//     const sourceFile = realGetSourceFile(
//         fileName,
//         languageVersion,
//         onError,
//         shouldCreateNewSourceFile
//     )
//     const moduleInfo = App.moduleThree.get(fileName)
//     if (moduleInfo && sourceFile) {

//         for (const writerKeyPath in moduleInfo.writers) {
//             moduleInfo.writers[writerKeyPath].writeSourceFile(sourceFile)
//         }
//     }

//     return sourceFile
//     return realGetSourceFile(
//         fileName,
//         languageVersion,
//         onError,
//         shouldCreateNewSourceFile
//     )
// }