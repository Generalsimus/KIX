"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readIndexHtml = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readJsDomHtml_1 = require("./readJsDomHtml");
function readIndexHtml(host) {
    const indexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(indexHTMLPath)) {
        throw console.error(`Couldn't find ${indexHTMLPath} file.`);
    }
    const rootNames = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
    host.watcher.createWatcher({
        filePath: indexHTMLPath,
        callBack: () => {
            host.rootNames = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
        }
    });
    return rootNames;
}
exports.readIndexHtml = readIndexHtml;
;
