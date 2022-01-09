import ts from "typescript"
import { App } from ".."
import { createCompiler } from "../compiler"
import { newSourceFilesPathSet } from "./readFile"

type GetSourceFileType = ts.CompilerHost["getSourceFile"]

let realGetSourceFile: GetSourceFileType = () => {
    throw Error("getSourceFile is not implemented")
}

// const writer = 
// const testMap = new Map()
export const createGetSourceFile = (host: ts.CompilerHost, options: ts.CompilerOptions | undefined) => {
    // .getSourceFile 
    // program: ts.SemanticDiagnosticsBuilderProgram
    realGetSourceFile = host.getSourceFile
    // console.log("🚀 --> file: getSourceFile.ts --> line 17 -.-> createGetSourceFile --> options", options);
    // host.

    if (!options) {
        throw new Error("CompilerOptions is undefined")

    }
    //

    return getSourceFile
}






// newSourceFilesSet





export function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: ((message: string) => void) | undefined,
    shouldCreateNewSourceFile?: boolean | undefined
): ts.SourceFile | undefined {
    const sourceFile = realGetSourceFile(
        fileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile
    )
    const moduleInfo = App.moduleThree.get(fileName)
    // console.log("🚀 --> file: getSourceFile.ts --> line 54 --> moduleInfo", moduleInfo);
    if (moduleInfo && sourceFile) {

        for (const writerKeyPath in moduleInfo.writers) {
            moduleInfo.writers[writerKeyPath].writeSourceFile(sourceFile)
        }
    }

    // testMap.set(fileName, sourceFile)
    return sourceFile
}