"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = __importDefault(require("path"));
const readIndexHtml_1 = require("./readIndexHtml");
exports.App = {
    runDirName: path_1.default.resolve("./"),
    indexHTMLUrlPaths: ["/", "/index.html"],
    nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
    requestsThreshold: new Map(),
    moduleThree: new Map(),
    devMode: true,
    start() {
        (0, readIndexHtml_1.readIndexHtml)();
    },
};
