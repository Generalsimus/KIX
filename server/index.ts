import express from "express"
import WebSocket from "ws"
import http from "http"
import open from "open"
import mimeTypes from "mime-types"
import { App } from "../app"
import { saveLog } from "../utils/loger"
import { createProgramHost } from "../app/createProgram"

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
    send() {

    }
    listen() {
        this.server.listen(App.port, () => {
            // open(`http://localhost:${App.port}`);
        });
    }
    close() {
        this.server.close()
    }
}
// export const Server = () => {
//     const expressApp = express();
//     const server = http.createServer(expressApp);
//     const WebSocketServer = new WebSocket.Server({ server, path: "/WebSocket" });
//     // type sss = express.RequestHandler
//     expressApp.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
//         const customResponse = App.requestsThreshold.get(req.path)
//         if (customResponse) {
//             res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
//             customResponse(req, res, next);
//         } else {

//             next()
//         }
//     })
//     // app.use(function (req, res, next) {
//     //     res.header("Cache-Control", "no-cache");
//     //     // console.log("🚀 --> file: express.js --> line 25 --> __requestsThreshold", __requestsThreshold.keys())
//     //     // console.log("🚀 --> file: express.js --> line 25 --> __requestsThreshold", req.path)
//     //     if (__requestsThreshold.has(req.path)) {
//     //         res.header("content-type", mimeTypes.lookup(req.path) || "text/html");
//     //         res.end(__requestsThreshold.get(req.path))
//     //     } else {

//     //         const requestPath = normalizeSlashes(path.join(__RunDirName, req.path).toLocaleLowerCase())
//     //         for (const [_, value] of __compiledFilesThreshold) {
//     //             if (value.getFilesByNameMap().has(requestPath)) {
//     //                 return;
//     //             }

//     //         }
//     //         next();
//     //     }
//     // });
//     // //
//     expressApp.use("./", express.static(App.runDirName));

//     const listener = server.listen(App.port, function () {
//         const httpUrl = `http://${`localhost:${App.port}`}`;

//         saveLog({
//             "\nYou can now view in the browser: ": "white",
//             [httpUrl]: "blue",
//             "\nTo create a production build, use": "white",
//             "npm build": "blue",
//         })
//         open(httpUrl);
//     });

// }