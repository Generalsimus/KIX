import ts from "typescript";
import { createProgramHost } from "./";

export function getSourceFileByPath(
    this: createProgramHost,
    fileName: string,
    path?: ts.Path,
    languageVersionOrOptions?: ts.ScriptTarget | ts.CreateSourceFileOptions,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
): ts.SourceFile | undefined {

    return this.sourceFileCache.get(fileName)
} 