"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = void 0;
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const open_1 = __importDefault(require("open"));
const mime_types_1 = __importDefault(require("mime-types"));
const webSocketUrl_1 = require("../main/codeController/webSocket/webSocketUrl");
const SocketMessageControler_1 = require("./SocketMessageControler");
const initServer = ({ __RunDirName, __requestsThreshold, __compilerOptions: { port } }) => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    const WebSocketServer = new ws_1.default.Server({ server, path: webSocketUrl_1.webSocketUrl });
    app.use(function (req, res, next) {
        res.header("Cache-Control", "no-cache");
        // console.log("🚀 --> file: express.js --> line 20 --> req.path", req.path);
        if (__requestsThreshold.has(req.path)) {
            res.header("content-type", mime_types_1.default.lookup(req.path) || "text/html");
            res.end(__requestsThreshold.get(req.path));
        }
        else {
            next();
        }
    });
    app.use("./", express_1.default.static(__RunDirName));
    const listener = server.listen(port, function () {
        const http_url = `http://${`localhost:${listener.address()["port"]}`}`;
        (0, open_1.default)(http_url);
        // console.log(http_url)
        // console.save(`\nYou can now view in the browser: `, "white", http_url, 'blue', `\nTo create a production build, use: `, "white", 'npm build', 'blue')
        // console.log('\x1b[32m%s\x1b[0m',);
    });
    const socketClientSender = (action = "RESTART_SERVER", data = {}) => {
        WebSocketServer.clients.forEach(ws => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ action, data }));
            }
        });
    };
    (0, SocketMessageControler_1.listenSocketMessages)(WebSocketServer, socketClientSender);
    return {
        WebSocketServer,
        socketClientSender: socketClientSender,
        listener
    };
};
exports.initServer = initServer;