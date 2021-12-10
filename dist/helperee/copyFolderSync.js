"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFolderSync = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const copyFolderSync = (from, to, ignorePaths = []) => {
    const stat = fs_1.default.lstatSync(from);
    if (ignorePaths.includes(from)) {
        return;
    }
    if (stat.isFile()) {
        fs_1.default.copyFileSync(from, to);
    }
    else if (stat.isSymbolicLink()) {
        fs_1.default.symlinkSync(fs_1.default.readlinkSync(from), to);
    }
    else if (stat.isDirectory()) {
        try {
            fs_1.default.mkdirSync(to);
        }
        catch (e) { }
        fs_1.default.readdirSync(from).forEach((element) => {
            (0, exports.copyFolderSync)(path_1.default.join(from, element), path_1.default.join(to, element), ignorePaths);
        });
        if (!fs_1.default.readdirSync(to).length) {
            fs_1.default.rmdirSync(to, {
                recursive: true
            });
        }
    }
};
exports.copyFolderSync = copyFolderSync;
