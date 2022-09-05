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
const consola_1 = __importDefault(require("consola"));
function readIndexHtml() {
    const indexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(indexHTMLPath)) {
        throw consola_1.default.error(`Couldn't find ${indexHTMLPath} file.`);
    }
    const createHostProgram = () => {
        index_1.App.requestsThreshold.clear();
        const rootNames = (0, readJsDomHtml_1.readJsDomHtml)(indexHTMLPath);
        const defaultModuleRootNames = index_1.App.devMode ? [
            index_1.App.injectPaths.kix,
            index_1.App.injectPaths.codeController
        ] : [index_1.App.injectPaths.kix];
        const hostProgram = new createProgram_1.createProgramHost(rootNames, {
            module: typescript_1.default.ModuleKind.None,
            incremental: true,
            allowJs: true,
            removeComments: true,
            jsx: typescript_1.default.JsxEmit.Preserve,
            esModuleInterop: true,
            "moduleResolution": typescript_1.default.ModuleResolutionKind.NodeNext,
            lib: [
                index_1.App.injectPaths.kixType
            ],
            suppressOutputPathCheck: true,
        }, index_1.App.devMode, defaultModuleRootNames);
        hostProgram.watcher.createWatcher({
            filePath: indexHTMLPath,
            callBack: () => {
                hostProgram.close();
                createHostProgram();
            }
        });
        return hostProgram;
    };
    return createHostProgram();
}
exports.readIndexHtml = readIndexHtml;
;
