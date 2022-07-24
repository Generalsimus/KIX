// WebSocket
// import { errorCatcher } from './Error/errorCatcher';
// import { listenSocketMessages } from './listener';
import { errorListener } from './errorListener';
import { socketListener } from './socketListener';
import { webSocketUrlPath } from './webSocketUrlPath'

export const webSocketHost = new WebSocket("ws://" + window.location.host + webSocketUrlPath)

webSocketHost.addEventListener('message', socketListener);
window.addEventListener('error', errorListener)
