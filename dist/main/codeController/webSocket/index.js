"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebSocketMessage = exports.catchSocketMessages = void 0;
const SocketControlerFunctions_1 = require("./SocketControlerFunctions");
const index_1 = require("../index");
const catchSocketMessages = (event) => {
    try {
        const { action, data } = JSON.parse(event.data);
        SocketControlerFunctions_1.SocketControlerFunctions[action](data);
    }
    catch (e) { }
};
exports.catchSocketMessages = catchSocketMessages;
const sendWebSocketMessage = (action, data) => {
    const sendMessage = () => {
        index_1.webSocketHost.send(JSON.stringify({ action, data }));
    };
    if (index_1.webSocketHost.readyState === WebSocket.OPEN) {
        sendMessage();
    }
    else {
        const senderFunction = () => {
            sendMessage();
            index_1.webSocketHost.removeEventListener('open', senderFunction);
        };
        index_1.webSocketHost.addEventListener('open', senderFunction);
    }
};
exports.sendWebSocketMessage = sendWebSocketMessage;
