import { sendWebSocketMessage } from "../webSocket";
import { xhrtGetRequet } from "../xhrRequest";

export const catchError = (event) => {
    const parseUrlRegex = /(?=http)(.*?)(?=(:(\d*):(\d*)))/gm
    const errorsLocations = []
    let match;
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        errorsLocations.push({
            line: match[3],
            column: match[4],
            url: match[1],
            path: new window.URL(match[1]).pathname
        })
        xhrtGetRequet(match[1], parseSourceMap)
    }
    sendWebSocketMessage({ action: "THROW_ERROR", data: errorsLocations });
} // end catchError

 

const parseSourceMap = (sourceMap) => {
    const sourceMapObject = JSON.parse(sourceMap)
    const sources = sourceMapObject.sources
    const sourcesContent = sourceMapObject.sourcesContent
    const sourcesMap = {}
    sources.forEach((source, index) => {
        sourcesMap[source] = sourcesContent[index]
    })
    return sourcesMap
}