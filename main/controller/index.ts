// WebSocket
import { errorCatcher } from './Error/errorCatcher';
import { listenSocketMessages } from './listener';
import { webSocketUrlPath } from './webSocketUrlPath'
export const webSocketHost = new WebSocket("ws://" + window.location.host + webSocketUrlPath)
webSocketHost.addEventListener('message', listenSocketMessages);

// Error

window.addEventListener('error', errorCatcher)