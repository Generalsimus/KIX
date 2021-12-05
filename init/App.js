import yargs from "yargs"
import {
    hideBin
} from "yargs/helpers"
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
    parseJsonFile,
    resolveKixModule
} from "../Helpers/utils.js"
import resolve from "resolve"
import { buildApp } from "./build.js"
import { createTemplate } from "./createTemplate/createTemplate.js"
import { spawn } from "child_process"


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
        sourceMap: true,
    },
    priorityCompilerOptions = {
        module: ModuleKind.AMD,
        checkJs: false,
        allowJs: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        moduleResolution: ModuleResolutionKind.NodeJs,
        suppressOutputPathCheck: true,
        forceConsistentCasingInFileNames: true,
        watch: true,
        jsx: "preserve",
        __Node_Module_Window_Name: getModuleWindowName(),
        "noImplicitAny": true,

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
        ),
        __diagnostics
    ),
    __Host = createHost(__compilerOptions),
    __TranspilingMeta = {},
    __ModuleUrlPath = `/module${new Date().getTime()}.js`;


// console.log("🚀 --> file: App.js --> line 85 --> __compilerOptions", path.join(__dirname, "../../main/index.js"),)


export const App = {
    __RunDirName: __RunDirName,
    __compilerOptions: __compilerOptions,
    __diagnostics: __diagnostics,
    __args: __args,
    __Dev_Mode: !!__args._?.includes("start"),
    __Host,
    __packageJson: __packageJson,
    __requestsThreshold: new Map(),
    __kixModuleLocation: resolveKixModule(__dirname),
    __kixLocalLocation: normalizeSlashes(path.join(__dirname, "../../main/index.js")),
    __TranspilingMeta,
    __ModuleUrlPath,
    __IndexHTMLRequesPaths: ["/", "/index.html"],
    priorityCompilerOptions,
    defaultCompilerOptions,
    init() {
        const runBuild = __args._.includes("build")
        const runStart = this.__Dev_Mode
        const runNew = __args._.includes("new")
        const runIndexHtmlReader = () => {
            const {
                ReadIndexHTML
            } = require("./readIndex")
            const indexHTMLReader = ReadIndexHTML(this)
            if (runStart) {
                indexHTMLReader.watchIndexHTML()
            } else {
                indexHTMLReader.readJsDomHTML()
            }
        }
        const runExpressServer = () => {
            const {
                initServer
            } = require("./express.js")

            this.server = initServer(this)
        }
        if (runBuild || runStart) {
            if (runStart) {
                if (!this.__kixModuleLocation && !this.__kixModuleLocation?.includes(this.__RunDirName)) {
                    spawn('npm', ["run", "dev"], {
                        shell: true,
                        stdio: 'inherit'
                    }).on("close", () => {
                        runExpressServer()
                        runIndexHtmlReader()
                    })
                    return;
                }
                runExpressServer()
            }
            if (runBuild) {
                buildApp()
            }
            runIndexHtmlReader()
        }

        if (runNew) {
            createTemplate()
        }

    },


} 
