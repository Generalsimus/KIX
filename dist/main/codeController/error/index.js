"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const webSocket_1 = require("../webSocket");
const xhrRequest_1 = require("../xhrRequest");
const catchError = (event) => {
    const parseUrlRegex = /(?=http)(.*?)(?=(:(\d*):(\d*)))/gm;
    const errorsLocations = [];
    let match;
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        errorsLocations.push({
            line: match[3],
            column: match[4],
            url: match[1],
            path: new window.URL(match[1]).pathname
        });
        (0, xhrRequest_1.xhrtGetRequet)(match[1], parseSourceMap);
    }
    (0, webSocket_1.sendWebSocketMessage)({ action: "THROW_ERROR", data: errorsLocations });
}; // end catchError
exports.catchError = catchError;
const parseSourceMap = (sourceMap) => {
    const sourceMapObject = JSON.parse(sourceMap);
    const sources = sourceMapObject.sources;
    const sourcesContent = sourceMapObject.sourcesContent;
    const sourcesMap = {};
    sources.forEach((source, index) => {
        sourcesMap[source] = sourcesContent[index];
    });
    return sourcesMap;
};
