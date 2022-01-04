"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenSocketMessages = exports.SocketControlerFunctions = void 0;
const ERROR_CODE_1 = require("./ERROR_CODE");
const utils_1 = require("./utils");
exports.SocketControlerFunctions = {
    ERROR_CODE: ERROR_CODE_1.ERROR_CODE
};
const listenSocketMessages = (ws, socketClientSender) => {
    ws.on('connection', function (connectedWs) {
        (0, utils_1.sendFileDiagnostics)(connectedWs, socketClientSender);
        connectedWs.on('message', (message) => {
            try {
                const { action, data } = JSON.parse(message);
                exports.SocketControlerFunctions[action](data, socketClientSender);
            }
            catch (error) {
                console.log({ error });
            }
        });
    });
};
exports.listenSocketMessages = listenSocketMessages;
