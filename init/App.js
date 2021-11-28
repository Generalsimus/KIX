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
    ModuleResolutionKind,
    normalizeSlashes,
    resolvePath,
    normalizePath
} from "typescript"
import path from "path"
import fs from "fs"
import {
    createHost,
    deepAssign,
    fixLibFileLocationInCompilerOptions,
    getImportModuleName,
    getModuleWindowName,
    parseJsonFile
} from "../Helpers/utils.js"
import {
    transpilerBefore,
    transpilerAfter
} from "./Compiler/Transpiler/Module.js"
import resolve from "resolve"
import { buildApp } from "./build.js"
import { createTemplate } from "./createTemplate/createTemplate.js"



// create default config 
const __RunDirName = normalizeSlashes(path.resolve("./")),
    __args = yargs(hideBin(process.argv)).argv,
    defaultCompilerOptions = {
        "outFile": "app.js",
        "outDir": "./build",
        "rootDir": "./",
        "baseUrl": "./",
        "lib": [
            "es2015"
        ],
        checkJs: true,
        sourceMap: true,
    },
    priorityCompilerOptions = {
        module: ModuleKind.AMD,
        allowJs: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        moduleResolution: ModuleResolutionKind.NodeJs,
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
    },
    __diagnostics = [],
    // read package.json file 
    __packageJson = parseJsonFile(ts.findConfigFile(__RunDirName + "/", fs.existsSync, "package.json")) || {},
    /////////////////////////
    // read tsConfig.json file 
    __TsConfig = parseJsonFile(ts.findConfigFile(__RunDirName, fs.existsSync)) || {},
    /////////////////////////host.getDefaultLibFileName(options);
    __compilerOptions = fixupCompilerOptions(
        deepAssign(
            defaultCompilerOptions,
            __TsConfig.compilerOptions,
            __packageJson.compilerOptions,
            priorityCompilerOptions,
            {
                __Node_Module_Window_Name: getModuleWindowName(),
            }
        ),
        __diagnostics
    ),
    __Host = createHost(__compilerOptions),
    __TranspilingMeta = {},
    __ModuleUrlPath = `/module${new Date().getTime()}.js`;


// console.log("🚀 --> file: App.js --> line 85 --> __compilerOptions", __compilerOptions)


export const App = {
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
        const runBuild = __args._.includes("build")
        const runStart = __args._.includes("start")
        const runNew = __args._.includes("new")

        if (runBuild || runStart) {
            if (runStart) {
                const {
                    initServer
                } = require("./express.js")

                this.server = initServer(this)
            }
            if (runBuild) {
                buildApp()
            }
            const {
                ReadIndexHTML
            } = require("./readIndex")
            const indexHTMLReader = ReadIndexHTML(this)

            indexHTMLReader.readJsDomHTML()
        }

        if (runNew) {
            createTemplate()
        }

    },


} 
