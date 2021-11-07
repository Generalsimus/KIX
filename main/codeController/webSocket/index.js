import { SocketControlerFunctions } from "./SocketControlerFunctions"
import { webSocketHost } from "../index"




export const catchSocketMessages = (event) => {
    try {
        const { action, data } = JSON.parse(event.data)
        SocketControlerFunctions[action](data)
    } catch (e) { }
}

export const sendWebSocketMessage = (action, data) => {
    const sendMessage = () => {
        webSocketHost.send(JSON.stringify({ action, data }))
    }
    if (webSocketHost.readyState === WebSocket.OPEN) {
        sendMessage()
    } else {
        const senderFunction = () => {
            sendMessage()
            webSocketHost.removeEventListener('open', senderFunction)
        }
        webSocketHost.addEventListener('open', senderFunction);
    }
}