import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { App } from "../app"
import { createProgramHost } from "../app/createProgram"
import { getSafePort } from "./utils/getSafePort"

export class Server {
    webSocketServer: WebSocket.Server
    server: http.Server
    expressApp: express.Express
    constructor(host: createProgramHost) {
        this.expressApp = express();
        this.server = http.createServer(this.expressApp);
        this.webSocketServer = new WebSocket.Server({ server: this.server, path: "/WebSocket" });
        this.expressApp.use(this.middleware);
        this.listen()
    }
    middleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        const customResponse = App.requestsThreshold.get(req.path)

        // console.log("🚀 --> file: index.ts --> line 23 --> Server --> middleware --> App.requestsThreshold", App.requestsThreshold.keys(), req.path);

        if (customResponse) {
            res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
            customResponse(req, res, next);
        } else {

            next()
        }
    }
    // send() {

    // } 
    listen() {
        getSafePort(App.port).then((safePort) => {
            this.server.listen(safePort, () => {
                open(`http://localhost:${safePort}`);
            });
        })
    }
    close() {
        this.server.close()
    }
}
