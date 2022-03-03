import path from "path";
import { decode } from "sourcemap-codec";
import { App } from "../../../app";
import { parsedErrorType } from "./parseError";

export const getSourceMapFileContent = (sourceMapString: string | undefined, parsedError: parsedErrorType): parsedErrorType | undefined => {
    if (!sourceMapString) return
    const sourceMapToObject = JSON.parse(sourceMapString);
    const decodedMappings = decode(sourceMapToObject.mappings);
    const errorLine = decodedMappings[Math.min(parsedError.line, decodedMappings.length)];
    if (!errorLine) return;

    let lineOriginalCode = 0;
    let columnOriginalCode = parsedError.column;
    let fileText: string | undefined = undefined;
    let filePath: string = parsedError.path;
    for (const mapDecodedColumn of errorLine) {
        const sourceCode = sourceMapToObject.sourcesContent[mapDecodedColumn[1]!];
        if (sourceCode && mapDecodedColumn[3]! <= parsedError.column) {
            fileText = sourceCode;
            filePath = sourceMapToObject.sources[mapDecodedColumn[1]!];
            columnOriginalCode = mapDecodedColumn[3]!
            lineOriginalCode = mapDecodedColumn[2]!
        }

    }
    if (!fileText) return



    return {
        ...parsedError,
        fileText,
        line: lineOriginalCode,
        column: columnOriginalCode,
        fileName: path.join(App.runDirName, filePath),
        path: filePath
    }
}