import { SocketControlerFunctions } from "./SocketMessageControler"
import { webSocketHost } from "../index"






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