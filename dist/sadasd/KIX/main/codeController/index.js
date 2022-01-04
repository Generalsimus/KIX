"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketHost = void 0;
const webSocketUrl_1 = require("./webSocket/webSocketUrl");
const error_1 = require("./error");
const SocketMessageControler_1 = require("./webSocket/SocketMessageControler");
exports.webSocketHost = new WebSocket("ws://" + window.location.host + webSocketUrl_1.webSocketUrl);
exports.webSocketHost.addEventListener('message', SocketMessageControler_1.listenSocketMessages);
window.addEventListener('error', error_1.catchError);
