
import { webSocketUrl } from "./webSocket/webSocketUrl"
import { catchError } from "./error";
import { catchSocketMessages } from "./webSocket";


// WebSocket
export const webSocketHost = new WebSocket("ws://" + window.location.host + webSocketUrl)
webSocketHost.addEventListener('message', catchSocketMessages);

// Error
window.addEventListener('error', catchError)