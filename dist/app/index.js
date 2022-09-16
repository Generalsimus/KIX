"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = exports.runDirectory = exports.appDirectory = void 0;
const command_1 = require("../command");
const path_1 = __importDefault(require("path"));
exports.appDirectory = path_1.default.resolve(__dirname, "../../");
exports.runDirectory = path_1.default.resolve("./");
const startApp = () => {
    (0, command_1.readCommandsAndRun)();
};
exports.startApp = startApp;
