"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFiles = exports.getSourceFile = void 0;
const typescript_1 = require("typescript");
const fs_1 = __importDefault(require("fs"));
const chokidar_1 = __importDefault(require("chokidar"));
const utils_1 = require("../../Helpers/utils");
const getSourceFile = (App, { FilePath, PathScriptKind }) => {
    const { __Target } = App;
    const sourceFile = typescript_1.createSourceFile(FilePath, fs_1.default.readFileSync(FilePath, "utf8"), __Target, true, PathScriptKind);
    chokidar_1.default.watch(FilePath).on('add', () => {
    }).on('change', () => {
    });
    return sourceFile;
};
exports.getSourceFile = getSourceFile;
const getSourceFiles = (App, FilePath, SourceFiles = []) => {
    const { __SourceFileThreshold } = App;
    const sourceFile = __SourceFileThreshold.get(FilePath) || exports.getSourceFile(App, utils_1.getPathMeta(FilePath));
    SourceFiles.push(sourceFile);
    return SourceFiles;
};
exports.getSourceFiles = getSourceFiles;
