import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { webSocketUrl } from "../main/codeController/webSocket/webSocketUrl"
import { listenSocketMessages } from "./SocketMessageControler"
import path from "path"
import { normalizeSlashes } from 'typescript';
import { __compiledFilesThreshold } from "./Compiler/CompileFile";
import { saveLog } from "../helpers/loger"


export const initServer = ({ __RunDirName, __requestsThreshold, __compilerOptions: { port } }) => {

    const app = express();
    const server = http.createServer(app);
    const WebSocketServer = new WebSocket.Server({ server, path: webSocketUrl });



    app.use(function (req, res, next) {
        res.header("Cache-Control", "no-cache");
        if (__requestsThreshold.has(req.path)) {
            res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
            res.end(__requestsThreshold.get(req.path))
        } else {

            const requestPath = normalizeSlashes(path.join(__RunDirName, req.path).toLocaleLowerCase())
            for (const [_, value] of __compiledFilesThreshold) {
                if (value.getFilesByNameMap().has(requestPath)) {
                    return;
                }

            }
            next();
        }
    });
    // 
    app.use("./", express.static(__RunDirName));
    const listener = server.listen(port, function () {

        const http_url = `http://${`localhost:${listener.address()["port"]}`}`;

        open(http_url);

        // console.log(http_url)
        // √ Compiled successfully.
        // Browser application bundle generation
        // Generating browser application bundles
        saveLog({
            "\nYou can now view in the browser: ": "white",
            [http_url]: "blue",
            // "green",socketClientSender
            "\nTo create a production build, use": "white",
            "npm build": "blue",
        })
        // console.save(`\nYou can now view in the browser: `, "white", http_url, 'blue', `\nTo create a production build, use: `, "white", 'npm build', 'blue')

        // console.log('\x1b[32m%s\x1b[0m',);
    });
    const socketClientSender = (action, data) => {
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
