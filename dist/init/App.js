"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
// @ts-ignore
const typescript_1 = __importStar(require("typescript"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_js_1 = require("../Helpers/utils.js");
const build_js_1 = require("./build.js");
const createTemplate_js_1 = require("./createTemplate/createTemplate.js");
// create default config 
const __RunDirName = (0, typescript_1.normalizeSlashes)(path_1.default.resolve("./")), __args = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv, defaultCompilerOptions = {
    "outFile": "app.js",
    "outDir": "./build",
    "rootDir": "./",
    "baseUrl": "./",
    "lib": [
        "es2015"
    ],
    checkJs: true,
    sourceMap: true,
}, priorityCompilerOptions = {
    module: typescript_1.ModuleKind.AMD,
    allowJs: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
    suppressOutputPathCheck: true,
    forceConsistentCasingInFileNames: true,
    watch: true,
    jsx: "preserve",
    // jsx: "react",
    // rootDir: __RunDirName,
    // baseUrl: path.join(__dirname, "../../"),
    // typeRoots: [
    // __RunDirName,
    // __dirname,
    // path.join(__dirname, "../../")
    // ],
    // types: [__dirname, path.join(__dirname, "../../")], 
    // resetServerDate: () => {
    //     App.server.socketClientSender("RESTART_SERVER", {})
    // },
    "noImplicitAny": true,
    // "paths": {
    //     "kix": [__dirname] // this mapping is relative to "baseUrl" 
    // }
}, __diagnostics = [], 
// read package.json file 
__packageJson = (0, utils_js_1.parseJsonFile)(typescript_1.default.findConfigFile(__RunDirName + "/", fs_1.default.existsSync, "package.json")) || {}, 
/////////////////////////
// read tsConfig.json file 
__TsConfig = (0, utils_js_1.parseJsonFile)(typescript_1.default.findConfigFile(__RunDirName, fs_1.default.existsSync)) || {}, 
/////////////////////////host.getDefaultLibFileName(options);
__compilerOptions = (0, typescript_1.fixupCompilerOptions)((0, utils_js_1.deepAssign)(defaultCompilerOptions, __TsConfig.compilerOptions, __packageJson.compilerOptions, priorityCompilerOptions, {
    __Node_Module_Window_Name: (0, utils_js_1.getModuleWindowName)(),
}), __diagnostics), __Host = (0, utils_js_1.createHost)(__compilerOptions), __TranspilingMeta = {}, __ModuleUrlPath = `/module${new Date().getTime()}.js`;
// console.log("🚀 --> file: App.js --> line 85 --> __compilerOptions", __compilerOptions)
exports.App = {
    __RunDirName: __RunDirName,
    __compilerOptions: __compilerOptions,
    __diagnostics: __diagnostics,
    __args: __args,
    __Dev_Mode: !__args["_"]?.includes("build"),
    __Host,
    __packageJson: __packageJson,
    __requestsThreshold: new Map(),
    __TranspilingMeta,
    __ModuleUrlPath,
    __IndexHTMLRequesPaths: ["/", "/index.html"],
    priorityCompilerOptions,
    defaultCompilerOptions,
    init() {
        const runBuild = __args._.includes("build");
        const runStart = __args._.includes("start");
        const runNew = __args._.includes("new");
        if (runBuild || runStart) {
            if (runStart) {
                const { initServer } = require("./express.js");
                this.server = initServer(this);
            }
            if (runBuild) {
                (0, build_js_1.buildApp)();
            }
            const { ReadIndexHTML } = require("./readIndex");
            const indexHTMLReader = ReadIndexHTML(this);
            indexHTMLReader.readJsDomHTML();
        }
        if (runNew) {
            (0, createTemplate_js_1.createTemplate)();
        }
    },
};
