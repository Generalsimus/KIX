"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readKixModules = void 0;
const __1 = require("../");
const posix_1 = __importDefault(require("path/posix"));
const fileNameToUrlPath_1 = require("../../utils/fileNameToUrlPath");
const getOutputFileName_1 = require("../../utils/getOutputFileName");
const normaliz_1 = require("../../utils/normaliz");
const readKixModules = (window) => {
    __1.App.moduleThree.clear();
    const document = window.document, programFiles = new Set();
    document
        .querySelectorAll('script')
        .forEach((scriptElement) => {
        var _a;
        if (((_a = scriptElement.getAttribute("lang")) === null || _a === void 0 ? void 0 : _a.trim()) !== "kix")
            return;
        scriptElement.removeAttribute("lang");
        const urlInfo = new window.URL(scriptElement.src, "http://e");
        const filePathName = (0, normaliz_1.normalizeSlashes)(posix_1.default.join(__1.App.runDirName, decodeURIComponent(urlInfo.pathname)));
        scriptElement.setAttribute("src", (0, fileNameToUrlPath_1.fileNameToUrlPath)((0, getOutputFileName_1.getOutputFileName)(filePathName)));
        programFiles.add(filePathName);
    });
    return [...programFiles];
};
exports.readKixModules = readKixModules;
