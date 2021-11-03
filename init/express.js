import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { getWebSocketUrl } from "../main/getWebSocketUrl"

export const initServer = ({ __RunDirName, __requestsThreshold, __compilerOptions: { port } }) => {

    const app = express();
    const server = http.createServer(app);
    const WebSocketServer = new WebSocket.Server({ server, path: `/${Date.now()}/AppControler` });


    // WebSocket
    app.use(function (req, res, next) {
        // ._parsedUrl.pathname
        res.header("Cache-Control", "no-cache");

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
    // console.log("🚀 ---> file: express.js ---> line 26 ---> listener ---> listener", listener)

    return {
        WebSocketServer,
        listener
    }
}