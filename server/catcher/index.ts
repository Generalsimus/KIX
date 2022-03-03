import { Server } from "..";
import WebSocket from "ws";
import { cachedErrType } from "./action-types";
import { parseErrorMessage } from "./utils/parseError";


export const actions = {
    CATCH_ERROR: (serverHost: Server, client: WebSocket, data: cachedErrType) => {
        const resendMessages = parseErrorMessage(serverHost.host, data);

        for (const alertMessage of resendMessages) {
            client.send(JSON.stringify({
                action: "ALERT_ERROR",
                data: alertMessage
            }))
        }
    }
}

export function messageCatcher(this: Server, client: WebSocket, message: { action: string, data: any }): void {
    (actions as any)[message.action](this, client, message.data);
}