"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readIndexHtml = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const index_1 = require("../index");
const createProgram_1 = require("../createProgram");
const readJsDomHtml_1 = require("./readJsDomHtml");
function readIndexHtml() {
    const indexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(indexHTMLPath)) {
        throw console.error(`Couldn't find ${indexHTMLPath} file.`);
    }
    const createHostProgram = () => {
        index_1.App.requestsThreshold.clear();
        const rootNames = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
        const hostProgram = new createProgram_1.createProgramHost(rootNames, {
            module: typescript_1.default.ModuleKind.ESNext,
            incremental: true,
            allowJs: true,
            removeComments: true,
            jsx: typescript_1.default.JsxEmit.Preserve,
            esModuleInterop: false,
            suppressOutputPathCheck: true,
        }, index_1.App.devMode, [
            index_1.App.kixModulePath
        ]);
        hostProgram.watcher.createWatcher({
            filePath: indexHTMLPath,
            callBack: () => {
                hostProgram.close();
                createHostProgram();
            }
        });
        return hostProgram;
    };
    createHostProgram();
}
exports.readIndexHtml = readIndexHtml;
;
