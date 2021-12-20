"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const webSocket_1 = require("../webSocket");
const catchError = (event) => {
    const parseUrlRegex = /((\s+at)?)(.*?)(\(?)(@?)(?=http)(.*?)(?=(:(\d*):(\d*)))/gm;
    let match;
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        const errorData = {
            line: parseInt(match[8]),
            column: parseInt(match[9]),
            url: match[6],
            errorMessage: match[3].trim() || event.error.message,
            path: new window.URL(match[6]).pathname
        };
        (0, webSocket_1.sendWebSocketMessage)("ERROR_CODE", errorData);
    }
};
exports.catchError = catchError;
