"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readIndexHtml = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const readJsDomHtml_1 = require("./readJsDomHtml");
const index_1 = require("../index");
const readIndexHtml = () => {
    const indexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(indexHTMLPath)) {
        throw console.error(`Couldn't find ${indexHTMLPath} file.`);
    }
    let program = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
    if (index_1.App.devMode) {
        typescript_1.default.sys.watchFile(indexHTMLPath, () => {
            program.close();
            program = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
        });
    }
};
exports.readIndexHtml = readIndexHtml;
