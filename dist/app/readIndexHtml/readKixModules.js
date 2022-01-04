"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readKixModules = void 0;
const typescript_1 = __importDefault(require("typescript"));
const __1 = require("../");
const path_1 = __importDefault(require("path"));
const resetModuleThree_1 = require("./resetModuleThree");
const readKixModules = (window) => {
    const document = window.document, programFiles = new Set();
    document
        .querySelectorAll('script[lang="kix"]')
        .forEach((scriptElement) => {
        scriptElement.removeAttribute("lang");
        const urlInfo = new window.URL(scriptElement.src, "http://e");
        programFiles.add(typescript_1.default["normalizeSlashes"](path_1.default.join(__1.App.runDirName, decodeURIComponent(urlInfo.pathname))));
    });
    (0, resetModuleThree_1.resetModuleThree)(programFiles);
    return [...programFiles];
};
exports.readKixModules = readKixModules;
