import { Server } from "..";
import WebSocket from "ws";
import { cachedErrType } from "./action-types";
import { parseErrorMessage } from "./utils/parseError";


export const actions = {
    CATCH_ERROR: (serverHost: Server, client: WebSocket, data: cachedErrType) => {
        const resendMessage = parseErrorMessage(data)
        if (resendMessage) {
            client.send(resendMessage)
        }
    }
}

export function messageCatcher(this: Server, client: WebSocket, message: { action: string, data: any }): void {
    (actions as any)[message.action](this, client, message.data);
}