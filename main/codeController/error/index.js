import {
    sendWebSocketMessage
} from "../webSocket";

export const catchError = (event) => {

    const parseUrlRegex = /((\s+at)?)(.*?)(\(?)(@?)(?=http)(.*?)(?=(:(\d*):(\d*)))/gm
    let match;
    while ((match = parseUrlRegex.exec(event.error.stack))) {
        const errorData = {
            line: parseInt(match[8]),
            column: parseInt(match[9]),
            url: match[6],
            errorMessage: match[3].trim() || event.error.message,
            path: new window.URL(match[6]).pathname
        }
        sendWebSocketMessage("ERROR_CODE", errorData)


    }

} // end catchError