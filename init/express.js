import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { webSocketUrl } from "../main/codeController/webSocket/webSocketUrl"
import { listenSocketMessages } from "./SocketMessageControler"

export const initServer = ({ __RunDirName, __requestsThreshold, __compilerOptions: { port } }) => {

    const app = express();
    const server = http.createServer(app);
    const WebSocketServer = new WebSocket.Server({ server, path: webSocketUrl });



    app.use(function (req, res, next) {
        res.header("Cache-Control", "no-cache");

        // console.log("🚀 --> file: express.js --> line 20 --> req.path", req.path);
        if (__requestsThreshold.has(req.path)) {
            res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
            res.end(__requestsThreshold.get(req.path))
        } else {
            next();
        }
    });
    app.use("./", express.static(__RunDirName));
    const listener = server.listen(port, function () {

        const http_url = `http://${`localhost:${listener.address()["port"]}`}`;

        open(http_url);

        // console.log(http_url)
        // console.save(`\nYou can now view in the browser: `, "white", http_url, 'blue', `\nTo create a production build, use: `, "white", 'npm build', 'blue')

        // console.log('\x1b[32m%s\x1b[0m',);
    });
    const socketClientSender = (action = "RESTART_SERVER", data = {}) => {
        WebSocketServer.clients.forEach(ws => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ action, data }))
            }
        })

    }
    listenSocketMessages(WebSocketServer, socketClientSender);
    return {
        WebSocketServer,
        socketClientSender: socketClientSender,
        listener
    }
}
