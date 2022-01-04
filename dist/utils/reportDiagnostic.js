"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportDiagnostic = exports.formatDiagnosticsHost = void 0;
const typescript_1 = __importDefault(require("typescript"));
const app_1 = require("../app");
const fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_\. ]+/g, toLowerCase = (fileName) => fileName.toLowerCase(), system = typescript_1.default.sys, createGetCanonicalFileName = () => {
    return typescript_1.default.sys.useCaseSensitiveFileNames
        ? (fileName) => fileName
        : (fileName) => {
            return fileNameLowerCaseRegExp.test(fileName)
                ? fileName.replace(fileNameLowerCaseRegExp, toLowerCase)
                : fileName;
        };
};
exports.formatDiagnosticsHost = {
    getCurrentDirectory: () => app_1.App.runDirName,
    getNewLine: () => typescript_1.default.sys.newLine,
    getCanonicalFileName: createGetCanonicalFileName(),
};
const reportDiagnostic = (diagnostic) => {
    typescript_1.default.sys.write(typescript_1.default.formatDiagnosticsWithColorAndContext([diagnostic], exports.formatDiagnosticsHost) + typescript_1.default.sys.newLine);
};
exports.reportDiagnostic = reportDiagnostic;
