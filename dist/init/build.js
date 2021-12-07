"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const copyFolderSync_1 = require("../helpers/copyFolderSync");
const App_1 = require("./App");
const process_1 = __importDefault(require("process"));
const safeFileWrite_1 = require("../helpers/safeFileWrite");
const loger_1 = require("../helpers/loger");
const buildApp = () => {
    const { __compiledFilesThreshold } = require("./Compiler/CompileFile");
    const buildFolderPath = path_1.default.join(App_1.App.__RunDirName, App_1.App.__compilerOptions.outDir);
    process_1.default.on('exit', () => {
        fs_1.default.rmSync(buildFolderPath, { recursive: true, force: true });
        (0, copyFolderSync_1.copyFolderSync)(App_1.App.__RunDirName, buildFolderPath, [
            buildFolderPath,
            path_1.default.join(App_1.App.__RunDirName, "node_modules"),
            ...(Array.from(__compiledFilesThreshold, ([_, program]) => {
                return program.getSourceFiles().map(file => path_1.default.resolve(file.originalFileName));
            }).flat(Infinity))
        ]);
        App_1.App.__requestsThreshold.forEach((fileContent, pathKey) => {
            const filePath = App_1.App.__IndexHTMLRequesPaths.includes(pathKey) ? "index.html" : pathKey;
            (0, safeFileWrite_1.safeFileWrite)(path_1.default.join(buildFolderPath, "zzsdsds/sadasd/s", filePath), String(fileContent));
        }),
            (0, loger_1.clareLog)({
                "\n√": "green",
                "Compiled successfully.": "green"
            });
    });
};
exports.buildApp = buildApp;
