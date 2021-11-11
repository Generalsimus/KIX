import { decode } from "../sourceMap/decode";
import { sendWebSocketMessage } from "../webSocket";
import { xhrGetRequet } from "../xhrRequest";
import { getSourceMapCachedData } from "../sourceMap/getSourceMapCachedData";
import { createErrorCode } from "./createErrorCode";

export const catchError = (event) => {
console.log("🚀 --> file: index.js --> line 7 --> catchError --> event", event);
    const parseUrlRegex = /(?=http)(.*?)(?=(:(\d*):(\d*)))/gm
    let match;
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        const errorLocation = {
            line: match[3],
            column: match[4],
            url: match[1],
            path: new window.URL(match[1]).pathname
        }

        getSourceMapCachedData(errorLocation.url + ".map", (sourceMapObject) => {

            parseSourceMap(sourceMapObject, errorLocation)

        })

    }
    // sendWebSocketMessage({ action: "THROW_ERROR", data: errorsLocations });
} // end catchError



const parseSourceMap = (sourceMapObject, errorLocation) => {

    const vlqDecoded = decode(sourceMapObject.mappings)
    console.log("🚀 --> file: index.js --> line 27 --> parseSourceMap --> vlqDecoded", vlqDecoded);

    xhrGetRequet(errorLocation.url, (responseJsFile) => {
        const responseJsFileLines = responseJsFile.split("\n");

        vlqDecoded.forEach((vlq, lineGeneratedCode) => {
            let originalFilecolumn = 0;
            let generatedFilecolumn = 0;
            vlq.forEach(([
                columnInGeneratedCode,
                correspondingSourceFile,
                LineNumberInOriginalCode,
                columnNumberInOriginalCode
            ]) => {
                const originalJsFileLines = sourceMapObject.sourcesContent[correspondingSourceFile].split("\n");
                const originalJsFileLine = originalJsFileLines[LineNumberInOriginalCode];
                const genratedJsFileLine = responseJsFileLines[lineGeneratedCode];
                console.log(
                    originalJsFileLine.slice(originalFilecolumn, columnNumberInOriginalCode),
                    ",,,,,,",
                    genratedJsFileLine.slice(generatedFilecolumn, columnInGeneratedCode)
                );
                createErrorCode()
                // console.log("🚀 --> file: index.js --> line 43 --> vlqDecoded.forEach -->  ",
                //     columnInGeneratedCode,
                //     correspondingSourceFile,
                //     LineNumberInOriginalCode,
                //     columnNumberInOriginalCode
                // );

                originalFilecolumn = columnNumberInOriginalCode;
                generatedFilecolumn = columnInGeneratedCode;
            })
        })
    })





    const sources = sourceMapObject.sources
    const sourcesContent = sourceMapObject.sourcesContent
    const sourcesMap = {}
    sources.forEach((source, index) => {
        sourcesMap[source] = sourcesContent[index]
    })
    return sourcesMap

}