"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeFileWrite = void 0;
const fs_1 = __importDefault(require("fs"));
const safeFileWrite = (filePath, fileContent) => {
    const splitPath = filePath.split(/[\\/]/);
    for (let i = 1; i < splitPath.length; i++) {
        const path = splitPath.slice(0, i).join('\\');
        try {
            fs_1.default.mkdirSync(path);
        }
        catch (e) { }
    }
    fs_1.default.writeFileSync(filePath, fileContent, "utf8");
};
exports.safeFileWrite = safeFileWrite;
