import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { App } from "../app"
import { createProgramHost } from "../app/createProgram"
import { getSafePort } from "./utils/getSafePort"
import { webSocketUrlPath } from "../main/controller/webSocketUrlPath"
import { filePathToUrl } from "../utils/filePathToUrl"
import { messageCatcher } from "./catcher"
export class Server {
    webSocketServer: WebSocket.Server
    server: http.Server
    expressApp: express.Express
    host: createProgramHost
    constructor(host: createProgramHost) {
        this.host = host;
        this.expressApp = express();
        this.server = http.createServer(this.expressApp);
        this.webSocketServer = new WebSocket.Server({ server: this.server, path: webSocketUrlPath });
        this.webSocketServer.on('connection', (client) => {
            this.initClient(client)
            client.on('message', (message) => {
                this.messageCatcher(client, JSON.parse(message.toString()))
            })
        });

        this.expressApp.use(this.middleware);
        this.listen()
    }
    messageCatcher = messageCatcher
    initClient(client: WebSocket) {

        for (const diagnostic of this.host.currentDiagnostics) {
            const diagnose = { ...diagnostic, file: undefined };
            client.send(JSON.stringify({
                action: "ALERT_ERROR",
                data: {
                    fileText: diagnostic.file?.getText(),
                    filePath: diagnostic.file?.fileName && filePathToUrl(diagnostic.file.fileName),
                    ...diagnose
                }
            }))
        }
    }
    sendSocketMessage(action: string, data: any) {
        console.log("🚀 --> file: index.ts --> line 36 --> Server --> sendSocketMessage --> action", action);
        this.webSocketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action, data }))
            }
        })

    }
    middleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        const customResponse = App.requestsThreshold.get(req.path)

        // console.log("🚀 --> file: index.ts --> line 23 --> Server --> middleware --> App.requestsThreshold", App.requestsThreshold.keys(), req.path);

        if (customResponse) {
            res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
            res.end(customResponse())
            // next
        } else {

            next()
        }
    }
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
