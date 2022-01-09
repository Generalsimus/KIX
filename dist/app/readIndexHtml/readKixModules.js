"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readKixModules = void 0;
const __1 = require("../");
const path_1 = __importDefault(require("path"));
const posix_1 = __importDefault(require("path/posix"));
const readKixModules = (window) => {
    const document = window.document, programFiles = new Set();
    document
        .querySelectorAll('script')
        .forEach((scriptElement) => {
        var _a;
        if (((_a = scriptElement.getAttribute("lang")) === null || _a === void 0 ? void 0 : _a.trim()) !== "kix")
            return;
        scriptElement.removeAttribute("lang");
        const urlInfo = new window.URL(scriptElement.src, "http://e");
        programFiles.add(posix_1.default.join(__1.App.runDirName, decodeURIComponent(urlInfo.pathname)).split(path_1.default.sep).join("/"));
    });
    __1.App.moduleThree.clear();
    return [...programFiles];
};
exports.readKixModules = readKixModules;
