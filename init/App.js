import yargs from "yargs"
import {
    hideBin
} from "yargs/helpers"
// @ts-ignore
import ts, {
    ModuleKind,
    visitEachChild,
    SyntaxKind,
    ScriptTarget,
    notImplemented,
    fixupCompilerOptions,
    createTextWriter,
    getTransformers,
    sys,
    ModuleResolutionKind, normalizeSlashes, resolvePath, normalizePath
} from "typescript"
import path from "path"
import fs from "fs"
import {
    createHost,
    deepAssign,
    getImportModuleName,
    getModuleWindowName,
    parseJsonFile
} from "../Helpers/utils.js"
import {
    transpilerBefore,
    transpilerAfter
} from "./Compiler/Transpiler/Module.js"
import resolve from "resolve"



// create default config
// console.log(ScriptTarget)
const __RunDirName = normalizeSlashes(path.resolve("./")),
    __args = yargs(hideBin(process.argv)).argv,
    defaultCompilerOptions = {
        "outFile": "app.js",
        "outDir": "./",
        "noImplicitUseStrict": true,
        alwaysStrict: false,
        // port: 0,
        // outFile: path.resolve("./"), 
        // emitDeclarationOnly:true,
        // "noUnusedLocals": true,
        // lib: [],
        lib: ["C:\\Users\\totor\\OneDrive\\Desktop\\node_react_examples\\KIDJS\\TS_KIX\\node_modules\\typescript\\lib\\lib.es2015.d.ts"],
        // target: ScriptTarget.ES3,
        suppressOutputPathCheck: true,
        removeComments: true,
        sourceMap: true,
        rootDir: __RunDirName,
        allowJs: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        moduleResolution: ModuleResolutionKind.NodeJs
    },
    priorityCompilerOptions = {
        module: ModuleKind.AMD,
        typeRoots: [
            __RunDirName
        ],
        __Node_Module_Window_Name: getModuleWindowName(),
        "noImplicitAny": true,
        "paths": {
            "kix": [__dirname]  // this mapping is relative to "baseUrl" 
        }
    },
    __diagnostics = [],
    // read package.json file 
    __packageJson = parseJsonFile(ts.findConfigFile(__RunDirName + "/", fs.existsSync, "package.json")) || {},
    /////////////////////////
    // read tsConfig.json file 
    __TsConfig = parseJsonFile(ts.findConfigFile(__RunDirName, fs.existsSync)) || {},
    /////////////////////////
    __compilerOptions = fixupCompilerOptions(deepAssign(defaultCompilerOptions, __TsConfig.compilerOptions, __packageJson.compilerOptions, priorityCompilerOptions), __diagnostics),
    __Host = createHost(__compilerOptions),
    __TranspilingMeta = {},
    __ModuleUrlPath = `/module${new Date().getTime()}.js`;




export const App = {
    __RunDirName: __RunDirName,
    __compilerOptions: __compilerOptions,
    // __Target: ScriptTarget.hasOwnProperty(OptionTarget) ? OptionTarget : "Latest",
    __diagnostics: __diagnostics,
    __args: __args,
    __Dev_Mode: !!__args["_"]?.includes("build"),
    __Host,
    __packageJson: __packageJson,
    __requestsThreshold: new Map(),
    __TranspilingMeta,
    __ModuleUrlPath,
    init() {

        if (!this.__compilerOptions.fileName) {

            const {
                initServer
            } = require("./express.js")
            const {
                ReadIndexHTML
            } = require("./readIndex")
            const server = initServer(this)
            const indexHTMLReader = ReadIndexHTML(this)

            indexHTMLReader.readJsDomHTML()

        }

    },


}