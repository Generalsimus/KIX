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
const path_1 = __importDefault(require("path"));
const typescript_1 = require("typescript");
const CompileFile_1 = require("./Compiler/CompileFile");
const loger_1 = require("../helpers/loger");
const initServer = ({ __RunDirName, __requestsThreshold, __compilerOptions: { port } }) => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    const WebSocketServer = new ws_1.default.Server({ server, path: webSocketUrl_1.webSocketUrl });
    app.use(function (req, res, next) {
        res.header("Cache-Control", "no-cache");
        if (__requestsThreshold.has(req.path)) {
            res.header("content-type", mime_types_1.default.lookup(req.path) || "text/html");
            res.end(__requestsThreshold.get(req.path));
        }
        else {
            const requestPath = (0, typescript_1.normalizeSlashes)(path_1.default.join(__RunDirName, req.path).toLocaleLowerCase());
            for (const [_, value] of CompileFile_1.__compiledFilesThreshold) {
                if (value.getFilesByNameMap().has(requestPath)) {
                    return;
                }
            }
            next();
        }
    });
    app.use("./", express_1.default.static(__RunDirName));
    const listener = server.listen(port, function () {
        const http_url = `http://${`localhost:${listener.address()["port"]}`}`;
        (0, open_1.default)(http_url);
        (0, loger_1.saveLog)({
            "\nYou can now view in the browser: ": "white",
            [http_url]: "blue",
            "\nTo create a production build, use": "white",
            "npm build": "blue",
        });
    });
    const socketClientSender = (action, data) => {
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
