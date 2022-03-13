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
        const hostProgram = new createProgram_1.createProgramHost(rootNames, {
            target: typescript_1.default.ScriptTarget.ES2020,
            module: typescript_1.default.ModuleKind.CommonJS,
            incremental: true,
            allowJs: true,
            removeComments: true,
            jsx: typescript_1.default.JsxEmit.Preserve,
            esModuleInterop: false,
            lib: [
                index_1.App.injectPaths.kixType
            ],
            suppressOutputPathCheck: true,
        }, index_1.App.devMode, [
            index_1.App.injectPaths.kix,
            index_1.App.injectPaths.codeController
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
