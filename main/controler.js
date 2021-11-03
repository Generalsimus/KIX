
import { getWebSocketUrl } from "./getWebSocketUrl"


const web_socket = new WebSocket(getWebSocketUrl)


web_socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

