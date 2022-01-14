"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = __importDefault(require("path"));
const resolveKixModule_1 = require("../utils/resolveKixModule");
const command_1 = require("../command");
const runDirName = path_1.default.resolve("./");
exports.App = {
    runDirName,
    realModuleDirName: path_1.default.resolve(__dirname, "../../"),
    port: 2222,
    outDir: "./dist/",
    indexHTMLUrlPaths: ["/", "/index.html"],
    nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
    importModulesAccessKey: `__KIX__IMPORT__MODULE__ACCESS_KEY__${new Date().getTime()}__`,
    windowModuleLocationName: "_KIX" + new Date().getTime(),
    requestsThreshold: new Map(),
    moduleThree: new Map(),
    kixModulePath: (0, resolveKixModule_1.resolveKixModule)(runDirName),
    devMode: true,
    parsedArgs: undefined,
    start() {
        (0, command_1.readCommandsAndRun)();
    },
};
