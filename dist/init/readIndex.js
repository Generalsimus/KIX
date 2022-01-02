"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadIndexHTML = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const consola_1 = __importDefault(require("consola"));
const chokidar_1 = __importDefault(require("chokidar"));
const jsdom_1 = require("jsdom");
const utils_1 = require("../helpers/utils");
const CompileFile_1 = require("./Compiler/CompileFile");
const localFiles_1 = require("./Compiler/localFiles");
const ReadIndexHTML = (App) => {
    const { __requestsThreshold, __RunDirName, __ModuleUrlPath, __Host, __compilerOptions, __IndexHTMLRequesPaths } = App;
    const __IndexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(__IndexHTMLPath)) {
        throw consola_1.default.error("Couldn't find index.html'");
    }
    return {
        watchIndexHTML() {
            const watchChange = () => {
                CompileFile_1.__compiledFilesThreshold.clear();
                __requestsThreshold.clear();
                this.readJsDomHTML();
            };
            chokidar_1.default.watch(__IndexHTMLPath).on('all', watchChange);
        },
        readJsDomHTML() {
            const HtmlDom = new jsdom_1.JSDOM(fs_1.default.readFileSync(__IndexHTMLPath, "utf8")), window = HtmlDom.window, document = window.document;
            document.body[document.body.firstElementChild ? "insertBefore" : "appendChild"](Object.assign(document.createElement('script'), { src: __ModuleUrlPath }), document.body.firstElementChild);
            const { IndexHtmlMainFilePaths, scriptTagInfos } = (0, utils_1.getScriptTagInfos)(document, window);
            for (const { filePath, compilerOptions } of scriptTagInfos) {
                (0, localFiles_1.initLocalFilesCompiler)(filePath, {
                    ...compilerOptions,
                    __IndexHtmlMainFilePaths: IndexHtmlMainFilePaths
                });
            }
            const INDEX_HTML_STRING = "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
            __IndexHTMLRequesPaths.forEach(INDEX_PATH => __requestsThreshold.set(INDEX_PATH, INDEX_HTML_STRING));
        },
    };
};
exports.ReadIndexHTML = ReadIndexHTML;
