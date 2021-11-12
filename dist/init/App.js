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
// create default configd
// console.log(ScriptTarget)
const __RunDirName = (0, typescript_1.normalizeSlashes)(path_1.default.resolve("./")), __args = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv, defaultCompilerOptions = {
    "outFile": "app.js",
    "outDir": "./",
    "noImplicitUseStrict": true,
    alwaysStrict: false,
    // port: 0,
    // outFile: path.resolve("./"), 
    // emitDeclarationOnly:true,
    // "noUnusedLocals": true,
    // lib: [],
    // lib: ["es2015"],
    // lib: ["C:\\Users\\totor\\OneDrive\\Desktop\\node_react_examples\\KIDJS\\TS_KIX\\node_modules\\typescript\\lib\\lib.es2015.d.ts"],
    // target: ScriptTarget.ES3,
    suppressOutputPathCheck: true,
    // removeComments: true,
    sourceMap: true,
    rootDir: __RunDirName,
    allowJs: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
    ///////////////////////
    forceConsistentCasingInFileNames: true,
    watch: true,
}, priorityCompilerOptions = {
    module: typescript_1.ModuleKind.AMD,
    typeRoots: [
        __RunDirName,
        __dirname
    ],
    __Node_Module_Window_Name: (0, utils_js_1.getModuleWindowName)(),
    "noImplicitAny": true,
    "paths": {
        "kix": [__dirname] // this mapping is relative to "baseUrl" 
    }
}, __diagnostics = [], 
// read package.json file 
__packageJson = (0, utils_js_1.parseJsonFile)(typescript_1.default.findConfigFile(__RunDirName + "/", fs_1.default.existsSync, "package.json")) || {}, 
/////////////////////////
// read tsConfig.json file 
__TsConfig = (0, utils_js_1.parseJsonFile)(typescript_1.default.findConfigFile(__RunDirName, fs_1.default.existsSync)) || {}, 
/////////////////////////host.getDefaultLibFileName(options);
__compilerOptions = (0, typescript_1.fixupCompilerOptions)((0, utils_js_1.deepAssign)(defaultCompilerOptions, __TsConfig.compilerOptions, __packageJson.compilerOptions, priorityCompilerOptions), __diagnostics), __Host = (0, utils_js_1.createHost)(__compilerOptions), __TranspilingMeta = {}, __ModuleUrlPath = `/module${new Date().getTime()}.js`;
// console.log("🚀 --> file: App.js --> line 81 --> __compilerOptions", __compilerOptions);
exports.App = {
    __RunDirName: __RunDirName,
    __compilerOptions: __compilerOptions,
    // __Target: ScriptTarget.hasOwnProperty(OptionTarget) ? OptionTarget : "Latest",
    __diagnostics: __diagnostics,
    __args: __args,
    __Dev_Mode: !__args["_"]?.includes("build"),
    __Host,
    __packageJson: __packageJson,
    __requestsThreshold: new Map(),
    __TranspilingMeta,
    __ModuleUrlPath,
    init() {
        if (!this.__compilerOptions.fileName) {
            const { initServer } = require("./express.js");
            const { ReadIndexHTML } = require("./readIndex");
            this.server = initServer(this);
            const indexHTMLReader = ReadIndexHTML(this);
            indexHTMLReader.readJsDomHTML();
        }
    },
};
