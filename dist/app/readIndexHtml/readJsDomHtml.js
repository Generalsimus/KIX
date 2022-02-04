"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsDomHtml = void 0;
const jsdom_1 = require("jsdom");
const fs_1 = __importDefault(require("fs"));
const readKixModules_1 = require("./readKixModules");
const __1 = require("..");
const readJsDomHtml = (indexHTMLPath) => {
    const htmlDom = new jsdom_1.JSDOM(fs_1.default.readFileSync(indexHTMLPath, "utf8")), window = htmlDom.window, document = window.document;
    document.body[document.body.firstElementChild ? "insertBefore" : "appendChild"](Object.assign(document.createElement("script"), {
        src: __1.App.nodeModulesUrlPath,
    }), document.body.firstElementChild);
    const kixModules = (0, readKixModules_1.readKixModules)(window);
    const indexHtmlPageString = "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
    for (const indexHTMLUrlPath of __1.App.indexHTMLUrlPaths) {
        __1.App.requestsThreshold.set(indexHTMLUrlPath, (_, res) => res.end(indexHtmlPageString));
    }
    return kixModules;
};
exports.readJsDomHtml = readJsDomHtml;
