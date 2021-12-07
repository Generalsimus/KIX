"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadIndexHTML = void 0;
const typescript_1 = require("typescript");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const consola_1 = __importDefault(require("consola"));
const chokidar_1 = __importDefault(require("chokidar"));
const jsdom_1 = require("jsdom");
const CompileFile_1 = require("./Compiler/CompileFile");
const utils_1 = require("../helpers/utils");
const CompileFile_2 = require("./Compiler/CompileFile");
const ReadIndexHTML = (App) => {
    const { __requestsThreshold, __RunDirName, __ModuleUrlPath, __Host, __compilerOptions, __IndexHTMLRequesPaths } = App;
    const __IndexHTMLPath = path_1.default.resolve("./index.html");
    if (!fs_1.default.existsSync(__IndexHTMLPath)) {
        throw consola_1.default.error("Couldn't find index.html'");
    }
    return {
        watchIndexHTML() {
            const watchChange = () => {
                CompileFile_2.__compiledFilesThreshold.clear();
                __requestsThreshold.clear();
                this.readJsDomHTML();
            };
            chokidar_1.default.watch(__IndexHTMLPath).on('all', watchChange);
        },
        readJsDomHTML() {
            // console.log("🚀 --> file: readIndex.js --> line 57 --> readJsDomHTML --> HTMLFilePaths", "HTMLFilePaths")
            const HtmlDom = new jsdom_1.JSDOM(fs_1.default.readFileSync(__IndexHTMLPath, "utf8")), window = HtmlDom.window, document = window.document;
            document.body[document.body.firstElementChild ? "insertBefore" : "appendChild"](Object.assign(document.createElement('script'), { src: __ModuleUrlPath }), document.body.firstElementChild);
            const HTMLFilePaths = Array.prototype.map.call(document.querySelectorAll('script[lang="kix"]'), (ELEMENT, index) => {
                var UrlMeta = new window.URL(ELEMENT.src, 'http://e'), FilePath = (0, typescript_1.normalizeSlashes)(path_1.default.join(__RunDirName, decodeURIComponent(UrlMeta.pathname)));
                return FilePath;
            });
            const compilerOptions = (0, utils_1.fixLibFileLocationInCompilerOptions)(__compilerOptions, __Host);
            // Compiler(FilePath)
            HTMLFilePaths.forEach(FilePath => (0, CompileFile_1.CompileFile)(FilePath, HTMLFilePaths, compilerOptions));
            const INDEX_HTML_STRING = "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
            __IndexHTMLRequesPaths.forEach(INDEX_PATH => __requestsThreshold.set(INDEX_PATH, INDEX_HTML_STRING));
        },
        // readIndexHTML() {
        //     if (fs.existsSync(__IndexHTMLPath)) {
        //         return fs.readFileSync(__IndexHTMLPath, "utf8")
        //     }
        // }
    };
};
exports.ReadIndexHTML = ReadIndexHTML;
