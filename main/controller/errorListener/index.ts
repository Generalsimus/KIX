import { webSocketHost } from ".."
import { cachedErrType } from "../../../server/catcher/action-types"

export const errorListener = (errorEvent: ErrorEvent) => {
    const errorData: cachedErrType = {
        errorMessage: errorEvent.error.message,
        errorStack: errorEvent.error.stack,
        filename: errorEvent.filename,
        line: errorEvent.lineno,
        coll: errorEvent.colno
    }
    webSocketHost.send(JSON.stringify({
        action: "CATCH_ERROR",
        data: errorData
    }))
}