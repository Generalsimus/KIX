"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFile = void 0;
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getSourceFile = (App, FilePath) => {
    console.log(typescript_1.default.ScriptTarget);
    console.log(typescript_1.default.ScriptKind, (FilePath.split(".").pop() || "TS").toUpperCase());
    const sourceFile = typescript_1.default.createSourceFile(FilePath, fs_1.default.readFileSync(FilePath, "utf8"), typescript_1.default.ScriptTarget["Latest"], true, typescript_1.default.ScriptKind[path_1.default.extname(FilePath).toUpperCase()]);
    return {
        sourceFile
    };
};
exports.getSourceFile = getSourceFile;
