import fs from "fs"
import path from "path"
import ts from "typescript"
import { createProgramHost } from "."
import { App } from ".."





export function getSourceFile(this: createProgramHost, fileName: string, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined): ts.SourceFile {
    // console.log("🚀 --> file: getSourceFile.ts --> line 8 --> getSourceFile --> fileName", fileName);

    let sourceFile = this.sourceFileCache.get(fileName)

    if (sourceFile) {
        return sourceFile
    }

    try {

        const { scriptKind, fileText } = this.readFileWithExt(fileName, path.extname(fileName))
        // if (!fileText) {
        //     throw new Error("Module not found")
        // }
        sourceFile = ts.createSourceFile(fileName, fileText || "", languageVersion, true, scriptKind);

        this.sourceFileCache.set(fileName, sourceFile)
        return sourceFile
    }
    catch (e: any) {

        if (onError) {
            onError(e.message);
        }

    }


    return ts.createSourceFile(fileName, "", languageVersion, true)
} 