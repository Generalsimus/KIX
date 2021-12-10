"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.clareLog = exports.log = exports.saveLog = void 0;
const consola_1 = __importDefault(require("consola"));
const customError_1 = require("./customError");
const savedLogs = [];
const colors = {
    white: "\x1b[37m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m"
};
const saveLog = (logObject) => {
    for (const Logstring in logObject) {
        savedLogs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`);
    }
    console.clear();
    console.log.apply(null, savedLogs);
};
exports.saveLog = saveLog;
const log = (logObject) => {
    const logs = [...savedLogs];
    for (const Logstring in logObject) {
        logs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`);
    }
    console.clear();
    console.log.apply(null, logs);
};
exports.log = log;
const clareLog = (logObject) => {
    const logs = [];
    for (const Logstring in logObject) {
        logs.push(`${colors[logObject[Logstring]] + Logstring}\x1b[0m`);
    }
    console.clear();
    console.log.apply(null, logs);
};
exports.clareLog = clareLog;
const logError = (error) => {
    consola_1.default.error(new customError_1.CustomError(error));
};
exports.logError = logError;
