import { webSocketHost } from "."

export const messageSender = (action: string, data: any) => {
    if (WebSocket.OPEN === webSocketHost.readyState) {
        webSocketHost.send(JSON.stringify({
            action: action,
            data: data
        }))
    } else {
        webSocketHost.addEventListener("open", () => {
            webSocketHost.send(JSON.stringify({
                action: action,
                data: data
            }))
        })
    }
}