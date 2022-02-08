"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = __importDefault(require("path"));
const command_1 = require("../command");
const getInjectCodePaths_1 = require("../utils/getInjectCodePaths");
const runDirName = path_1.default.resolve("./");
exports.App = {
    runDirName,
    realModuleDirName: path_1.default.resolve(__dirname, "../../"),
    port: 2222,
    outDir: "./dist/",
    indexHTMLUrlPaths: ["/", "/index.html"],
    nodeModulesUrlPath: `/module${new Date().getTime()}.js`,
    uniqAccessKey: `__KIX_ACCESS_KEY_${new Date().getTime()}_`,
    windowModuleLocationName: "_KIX" + new Date().getTime(),
    requestsThreshold: new Map(),
    injectPaths: (0, getInjectCodePaths_1.getInjectCodePaths)(runDirName),
    moduleThree: new Map(),
    devMode: false,
    parsedArgs: undefined,
    start() {
        (0, command_1.readCommandsAndRun)();
    },
};
