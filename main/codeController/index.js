import { webSocketUrl } from "./webSocket/webSocketUrl"
import { catchError } from "./error";
import { listenSocketMessages } from "./webSocket/SocketMessageControler";


// WebSocket
export const webSocketHost = new WebSocket("ws://" + window.location.host + webSocketUrl)
webSocketHost.addEventListener('message', listenSocketMessages);

// Error
window.addEventListener('error', catchError)