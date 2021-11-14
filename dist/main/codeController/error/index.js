"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const webSocket_1 = require("../webSocket");
const catchError = (event) => {
    console.log("🚀 --> file: index.js --> line 7 --> catchError --> event", event);
    // const parseUrlRegex = /(?=http)(.*?)(?=(:(\d*):(\d*)))/gm
    const parseUrlRegex = /((\s+at)?)(.*?)(\(?)(@?)(?=http)(.*?)(?=(:(\d*):(\d*)))/gm;
    let match;
    // console.log("🚀 --> file: index.js --> line 12 --> catchError --> event.error.stack", event.error.stack)
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        const errorData = {
            line: parseInt(match[8]),
            column: parseInt(match[9]),
            url: match[6],
            errorMessage: match[3].trim() || event.error.message,
            path: new window.URL(match[6]).pathname
        };
        (0, webSocket_1.sendWebSocketMessage)("ERROR_CODE", errorData);
        // getSourceMapCachedData(errorMatch[6] + ".map", (sourceMapObject) => {
        //     parseSourceMap(sourceMapObject, })
        // })
    }
    // sendWebSocketMessage({ action: "THROW_ERROR", data: errorsLocations });
}; // end catchError
exports.catchError = catchError;
