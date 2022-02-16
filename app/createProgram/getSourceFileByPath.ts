import ts from "typescript";
import { createProgramHost } from "./";

export function getSourceFileByPath(
    this: createProgramHost,
    fileName: string,
    path?: ts.Path,
    languageVersion?: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
): ts.SourceFile | undefined {
    // resolvedPath
    return this.sourceFileCache.get(fileName)
}