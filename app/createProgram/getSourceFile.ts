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

    let sourceFile = this.sourceFileCache.get(fileName)
    if (!sourceFile) {
        sourceFile = ts.createSourceFile(fileName, text, languageVersion, true)
        this.sourceFileCache.set(fileName, sourceFile)
    }
    return sourceFile
} 