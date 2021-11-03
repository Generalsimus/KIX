"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWebSocketUrl_1 = require("./getWebSocketUrl");
const web_socket = new WebSocket(getWebSocketUrl_1.getWebSocketUrl);
web_socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
//# sourceMappingURL=controler.js.map