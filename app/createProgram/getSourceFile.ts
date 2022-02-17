import fs from "fs"
import ts from "typescript"
import { createProgramHost } from "."
import { App } from ".."


export function getSourceFile(this: createProgramHost, fileName: string, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined): ts.SourceFile {

    let sourceFile = this.sourceFileCache.get(fileName)

    if (sourceFile) {
        return sourceFile
    }

    try {


        sourceFile = ts.createSourceFile(fileName, this.readFile(fileName), languageVersion, true);

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