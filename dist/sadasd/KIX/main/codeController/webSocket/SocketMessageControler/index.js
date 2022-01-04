"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenSocketMessages = exports.SocketControlerFunctions = void 0;
const ALERT_ERROR_1 = require("./ALERT_ERROR");
exports.SocketControlerFunctions = {
    RESTART_SERVER: (data) => {
        window.location.reload();
    },
    ALERT_ERROR: ALERT_ERROR_1.ALERT_ERROR
};
const listenSocketMessages = (event) => {
    try {
        const { action, data } = JSON.parse(event.data);
        exports.SocketControlerFunctions[action](data);
    }
    catch (e) { }
};
exports.listenSocketMessages = listenSocketMessages;
