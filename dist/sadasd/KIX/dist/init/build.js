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
const minify_1 = require("../helpers/minify");
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
        const ignorePaths = new Set();
        App_1.App.__requestsThreshold.forEach((fileContent, pathKey) => {
            const filePath = App_1.App.__IndexHTMLRequesPaths.includes(pathKey) ? "index.html" : pathKey;
            const fileFullPath = path_1.default.join(buildFolderPath, filePath);
            if (ignorePaths.has(filePath)) {
                return;
            }
            if (path_1.default.extname(filePath) === ".js") {
                const mapValue = App_1.App.__requestsThreshold.get(filePath + ".map");
                const mapPath = fileFullPath + ".map";
                const minifed = (0, minify_1.minify)(String(fileContent), mapValue);
                fileContent = minifed.code;
                ignorePaths.add(mapPath);
                if (minifed.map) {
                    const mapString = typeof minifed.map === "string" ? minifed.map : JSON.stringify(minifed.map);
                    (0, safeFileWrite_1.safeFileWrite)(mapPath, mapString);
                }
            }
            (0, safeFileWrite_1.safeFileWrite)(path_1.default.join(buildFolderPath, filePath), String(fileContent));
        }),
            (0, loger_1.clareLog)({
                "\n√": "green",
                "Compiled successfully.": "white"
            });
    });
};
exports.buildApp = buildApp;
