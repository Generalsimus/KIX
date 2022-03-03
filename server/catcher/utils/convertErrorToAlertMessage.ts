import { AlertErrorType } from "../../../main/controller/socketListener/createError/alertErrorType";
import { parsedErrorType } from "./parseError";

export const convertErrorToAlertMessage = (errorData: parsedErrorType): AlertErrorType | undefined => {
    const splitCode = errorData.fileText?.split("\n");
    let start: number | undefined = undefined;
    if (splitCode) {
        start = splitCode.slice(0, errorData.line).reduce((start, lineString) => {
            return start += (lineString.length)
        }, 0)

    }
    return {
        fileText: errorData.fileText,
        messageText: errorData.errorMessage,
        start: start,
        length: errorData.column,
        filePath: errorData.path
    }
} 