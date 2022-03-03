import path from "path";
import { App } from "../../../app";
import { createProgramHost } from "../../../app/createProgram";
import { filePathToUrl } from "../../../utils/filePathToUrl";
import { normalizeSlashes } from "../../../utils/normalizeSlashes";
import { cachedErrType } from "../action-types";
import { decode, encode } from 'sourcemap-codec';
import { getSourceMapFileContent } from "./getSourceMapFileContent";
import { AlertErrorType } from "../../../main/controller/socketListener/createError/alertErrorType";
import { convertErrorToAlertMessage } from "./convertErrorToAlertMessage";


export type parsedErrorType = {
    line: number;
    column: number;
    url: string;
    fileName: string;
    fileText: string | undefined;
    errorMessage: any;
    path: string;
}

export const parseErrorMessage = (host: createProgramHost, errorData: cachedErrType) => {
    const alertMessages: AlertErrorType[] = []
    const parseUrlRegex = /((\s+at)?)(.*?)(\(?)(@?)(?=http)(.*?)(?=(:(\d*):(\d*)))/gm
    let match;
    while ((match = parseUrlRegex.exec(errorData.errorStack))) {
        const fileRequestPath = new URL(match[6]).pathname;
        let parsedError: parsedErrorType = {
            line: parseInt(match[8]),
            column: parseInt(match[9]),
            url: match[6],
            fileName: path.join(App.runDirName, fileRequestPath),
            fileText: App.requestsThreshold.get(fileRequestPath)?.(),
            errorMessage: match[3].trim() || errorData.errorMessage,
            path: fileRequestPath
        }
        const sourceMap = App.requestsThreshold.get(parsedError.path + ".map")?.();
        parsedError = getSourceMapFileContent(sourceMap, parsedError) || parsedError;
        const alertData = convertErrorToAlertMessage(parsedError);
        if (alertData) {
            alertMessages.push(alertData)
        }
    }
    return alertMessages
}

