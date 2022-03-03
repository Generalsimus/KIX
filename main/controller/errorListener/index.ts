import { webSocketHost } from ".."
import { cachedErrType } from "../../../server/catcher/action-types"
import { messageSender } from "../messageSender"


export const errorListener = (errorEvent: ErrorEvent) => {
    const errorData: cachedErrType = {
        errorMessage: errorEvent.message,
        errorStack: errorEvent.error.stack,
        filename: errorEvent.filename,
        line: errorEvent.lineno,
        coll: errorEvent.colno
    }
    messageSender("CATCH_ERROR", errorData)

}