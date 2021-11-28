"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoPackageObject = void 0;
const utils_1 = require("../../Helpers/utils");
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const getDemoPackageObject = (appName) => {
    const pckageJson = (0, utils_1.parseJsonFile)(typescript_1.default.findConfigFile(__dirname, fs_1.default.existsSync, "./package.json"));
    return {
        "name": appName,
        "version": "1.0.0",
        "private": true,
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "repository": {
            "type": "git",
            "url": "git+https://github.com/Generalsimus/KIX.git"
        },
        "bugs": {
            "url": "https://github.com/Generalsimus/KIX/issues"
        },
        "homepage": "https://github.com/Generalsimus/KIX#readme",
        "devDependencies": {
            "kix": "^" + pckageJson.version
        },
        "dependencies": {}
    };
};
exports.getDemoPackageObject = getDemoPackageObject;
