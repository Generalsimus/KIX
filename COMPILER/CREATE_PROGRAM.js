const ts = require("typescript")
const path = require("path")
const fs = require("fs")
const {
    TRANSPILER_AFTER,
    TRANSPILER_BEFORE
} = require("./Modifer/TRANSPILER")
// const CSS_ = require("./Modifer/IMPORTER/CSS")
// const JSON_ = require("./Modifer/IMPORTER/JSON")
// const BASE64_ = require("./Modifer/IMPORTER/BASE64")
// const TEXT_ = require("./Modifer/IMPORTER/TEXT")
const resolve = require('resolve');
const chokidar = require('chokidar');
const Compiler_Host_Creator = require('./Helpers/Compiler_Host_Creator');
var { SourceMapConsumer } = require('source-map');




function Create_VISITOR(TRANSPILER) {
    return function (NODE, DATA, VISITOR, CTX) {

        // console.log(ts.SyntaxKind[NODE.kind])
        // if ("JsxElement" == ts.SyntaxKind[NODE.kind]) {

        //     console.log(CTX )
        //     console.log( CTX.hoistFunctionDeclaration( ))
        //     // console.log(NODE.openingElement.tagName)
        // }
        var new_NODE = TRANSPILER[NODE.kind] ? TRANSPILER[NODE.kind](NODE, DATA, VISITOR, CTX) : ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)

        return new_NODE;
    };
}
const BEFORE_VISITOR = Create_VISITOR(TRANSPILER_BEFORE)
const AFTER_VISITOR = Create_VISITOR(TRANSPILER_AFTER)







// console.log(ts.getDefaultLibFilePath(__dirname), __dirname + ts.directorySeparator, "zzzzzzzzzzzzzzz")

module.exports = function (LOCATION, DATA) {
    // console.log( C_O.target)
    LOCATION = ts.normalizeSlashes(LOCATION)
    // console.log([".js", ".jsx"].includes(path.extname(LOCATION).toLocaleLowerCase()))
    const DEFAULT_OPTIONS = {
        // fileName: DATA.HOST_LOCATION,
        fileName: DATA.HOST_LOCATION,
        // fileName: path.relative(DATA.Run_Dir, LOCATION),
        compilerOptions: {
            module: ts.ModuleKind.AMD,
            target: C_O.target || undefined,
            // target: ts.ScriptTarget.ES2020,
            suppressOutputPathCheck: true,
            inlineSources: true,
            removeComments: true,
            sourceMap: true,
            "rootDir": DATA.Run_Dir,
            "baseUrl": DATA.Run_Dir,
            allowJs: true,
            jsx: "react",
            "allowSyntheticDefaultImports": true,
            "resolveJsonModule": true,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            esModuleInterop: false,
            // "moduleResolution": "node",
            // noResolve:false,
            lib: [".js", ".jsx"].includes(path.extname(LOCATION).toLocaleLowerCase()) ? [] : undefined,
            // [path.resolve(__dirname + "/Helpers/LIBS/es2015.d.ts")],

            outFile: path.relative(DATA.Run_Dir, LOCATION),

            // "esModuleInterop": true,
            // "forceConsistentCasingInFileNames": true
        },
        // diagnostics:true,
        // "exclude" : [
        //     "node_modules/**/*", "coverage/**/*", "test/**/*", "style.css"
        //   ],
        // "filesGlob": [
        //     "*.ts",
        //     "*.tsx"
        //   ],
        // resolveJsonModule: "node",
        // "compileOnSave": true,
        transformers: {
            // con: "header:",
            before: [
                (CTX) => {
                    // console.log(CTX )
                    return function (NODE) {
                        return BEFORE_VISITOR(NODE, DATA, BEFORE_VISITOR, CTX)
                    }

                }
            ],
            after: [
                (CTX) => {
                    // console.log(CTX )
                    return function (NODE) {
                        return AFTER_VISITOR(NODE, DATA, AFTER_VISITOR, CTX)
                    }

                }
            ],


        },
        // reportDiagnostics: true,
    }








    var compilerHost = ts.createCompilerHostWorker(DEFAULT_OPTIONS),
        LAST_RESULT_CODE,
        LAST_RESULT_MAP,
        oldgetSourceFile = compilerHost.getSourceFile;


    const servicesHost = {
        setCompilerHost: function (DEFAULT_HOST) {
            return Object.assign(DEFAULT_HOST, Compiler_Host_Creator(DEFAULT_HOST, LOCATION, DATA))
        },
        getScriptFileNames: function () {
            // console.log("getScriptFileNames", arguments)
            return [LOCATION]
        },
        getScriptVersion: function (fileName) {
            // console.log("VERSION", fileName, DATA.Files_THRE[fileName]?.VERSION, String(DATA.Files_THRE[fileName]?.VERSION || 0))
            return String(DATA.Files_THRE[fileName]?.VERSION || 0)
            return String(DATA.Files_THRE[fileName]?.VERSION) || "0"
        },
        getScriptSnapshot: fileName => {
            // console.log("getScriptFileNames", arguments)
            if (fs.existsSync(fileName)) {
                return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
            }
        },
        getCurrentDirectory: () => {
            // console.log("getCurrentDirectory", arguments)
            return process.cwd()
        },
        getCompilationSettings: () => {
            // console.log("getCompilationSettings", arguments)
            return DEFAULT_OPTIONS.compilerOptions
        },
        getDefaultLibFileName: options => {
            // console.log("getDefaultLibFileName", arguments)
            return ts.getDefaultLibFilePath(options)
        },
        fileExists: function () {
            // console.log("fileExists", arguments)
            return ts.sys.fileExists(...arguments)
        },
        readFile: function () {
            // console.log("readFile", arguments)
            return ts.sys.readFile(...arguments)
        },
        readDirectory: function () {
            // console.log("readDirectory", arguments)
            return ts.sys.readDirectory(...arguments)
        },
        directoryExists: function () {
            // console.log("directoryExists", arguments)
            return ts.sys.directoryExists(...arguments)
        },
        getDirectories: function () {
            // console.log("getDirectories", arguments)
            return ts.sys.getDirectories(...arguments)
        },
        getCustomTransformers: function () {
            // console.log("getCustomTransformers", arguments)
            return DEFAULT_OPTIONS.transformers
        }
    };

    // console.log(ts.createDocumentRegistry())
    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    // console.log(services)
    var EMITED,
        MAPER,
        Consumer;
    return {
        getMap: function () {
            // let map = Js
            // console.log(services, services.getProgram())
            return EMITED.outputFiles[0].text
        },
        Emit: function () {
            // var randokm = new Date().getTime();

            // console.time("Time this" + randokm);

            EMITED = services.getEmitOutput(LOCATION)

            // console.timeEnd("Time this" + randokm);

            Consumer = undefined;
            // console.log(services)
            return this
        },
        // getSourceMapper: function () {

        //     return MAPER || (MAPER = services.getSourceMapper())
        // },
        getServices: () => services,
        getDiagnostics: function () {
            // console.log(services.getProgram().getSyntacticDiagnostics().concat(services.getProgram().getSemanticDiagnostics()))
            return services.getProgram().getSyntacticDiagnostics().concat(services.getProgram().getSemanticDiagnostics())
        },
        getConsumer: async function () {
            return Consumer || (Consumer = await new SourceMapConsumer(this.getMap()))
        },
        // function
        getCode: () => {

            // var Diagnostic = ts.getPreEmitDiagnostics(services.getProgram())
            // var EMITTER = PROGRAM.emit( /*targetSourceFile*/ undefined, /*writeFile*/ undefined, /*cancellationToken*/ undefined, /*emitOnlyDtsFiles*/ undefined, DEFAULT_OPTIONS.transformers);

            // console.log("PROGRAM", result, services.getSyntacticDiagnostics(LOCATION), services.getSemanticDiagnostics(LOCATION), "Diagnostic", "PROGRAM.getFilesByNameMap()", "emiter")
            // console.log("EMIT")


            return `(function(imports){${EMITED.outputFiles[1].text}\n })(window.KIX_PKG||(window.KIX_PKG=[]))\n//# sourceMappingURL=${DATA.REQUEST_url}.map`
            return {
                EMITTER: "EMITTER",
                Map: result.outputFiles[0].text,
                Code: `(function(imports){${result.outputFiles[1].text}\n })(window.KIX_PKG||(window.KIX_PKG=[]))\n//# sourceMappingURL=APP.js.map`
            }
        }
    }
}