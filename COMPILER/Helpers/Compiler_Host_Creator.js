const ts = require("typescript")
const fs = require("fs")
const path = require("path")
const resolve = require("resolve")
const CSS_ = require("../Modifer/IMPORTER/CSS")
const BASE64_ = require("../Modifer/IMPORTER/BASE64")






module.exports = function (DEFAULT_HOST, LOCATION, DATA) {


    function FILE_IMPORT(fileName, ARGUMENTS, GetOrCreateSourceFile) {

        // DATA
        if (!DATA.Files_THRE[fileName]) {
            var three = {
                IMPORTS_INDEX: ++DATA.Global_DATA.IMPORTS_INDEX,
                VERSION: 0
            }
            DATA.Files_THRE[fileName] = three

            if (DATA.DEVELOPER_MOD) {
                fs.watchFile(fileName, { persistent: true, interval: 25 }, (curr, prev) => {
                    // Check timestamp
                    if (+curr.mtime <= +prev.mtime) {
                        return;
                    }
                    three.VERSION++;
                    delete three.SourceFile
                    DATA.RESET_REQUEST_FILE()
                    
                    consola.success(fileName + `\x1b[32m COMPILED\x1b[0m`)
                    // console.log("three.VERSION", three.VERSION)
                });
            }
        } else if ("SourceFile" in DATA.Files_THRE[fileName]) {
            return DATA.Files_THRE[fileName].SourceFile
        }

        // console.log("fileName", fileName)
        switch (path.extname(fileName)) {
            // return
            case ".js":
            case ".tsx":
            case ".ts":
            case ".jsx":
            case ".json":
                return GetOrCreateSourceFile(...ARGUMENTS)
            // case ".json":
            //     // return undefined
            //   /////  return JSON_(fileName)
            // base64 IMAGES
            case ".css":
            case ".sass":
            case ".scss":
            case ".less":
                // console.log(CSS_(fileName, DATA))
                return DATA.Files_THRE[fileName].SourceFile = CSS_(fileName, DATA)

            case ".apng":
            case ".avif":
            case ".git":
            case ".jpg":
            case ".jpeg":
            case ".jfif":
            case ".pjpeg":
            case ".pjp":
            case ".png":
            case ".apng":
            case ".svg":
            case ".webp":
            case ".bmp":
            case ".ico":
            case ".cur":
            case ".tif":
            case ".tiff":
                return DATA.Files_THRE[fileName].SourceFile = BASE64_(fileName)

            default:
                if (path.extname(fileName)) {
                    return DATA.Files_THRE[fileName].SourceFile = TEXT_(fileName)
                }

        }


        // return DATA.Files_THRE[fileName].SourceFile
    }


    // console.log(DEFAULT_HOST)
    const {
        readFile,
        getSourceFile,
        getSourceFileByPath,
        fileExists,
        directoryExists,
        readDirectory,
        getCanonicalFileName,
        onReleaseOldSourceFile,
        resolveModuleNames
    } = DEFAULT_HOST


    return {
        getSourceFile: function (fileName) {
            // console.log(fileName)


            return FILE_IMPORT(fileName, arguments, getSourceFile)
        },
        getSourceFileByPath: function (fileName) {

            return FILE_IMPORT(fileName, arguments, getSourceFileByPath)
        },
        onReleaseOldSourceFile: function (SourceFile) {

            if ([".js", ".jsx", ".ts", ".tsx"].includes(path.extname(SourceFile.originalFileName))) {
                return onReleaseOldSourceFile(...arguments)
            }
            return
        },
        fileExists: function () {
            // console.log("fileExists", arguments)
            return fileExists(...arguments)
        },
        readFile: function () {
            // console.log("readFile", arguments, "awsd", readFile(...arguments), "readFileeeeeeeeeeeeeeeeeeeeeeeeee")
            return readFile(...arguments)
        },
        readDirectory: function () {
            // console.log("readDirectory", arguments)
            return readDirectory(...arguments)
        },
        getCanonicalFileName: function () {
            // console.log("getCanonicalFileName", getCanonicalFileName(...arguments))
            return getCanonicalFileName(...arguments)
        },
        resolveModuleNames: function (MODULES, MODULES_IN) {
            // resolve
            // console.log("resolveModuleNames", arguments)
            // return getCanonicalFileName(...arguments)
            // return MODULES
            // console.log(resolveModuleNames(...arguments))
            var new_module = MODULES.map((MODUL) => {
                try {
                    let RESOLVE = resolve.sync(MODUL, {
                        basedir: path.dirname(MODULES_IN),
                        extensions: [".ts", ".tsx", ".js", ".jsx"],
                    })

                    return {
                        resolvedFileName: ts.normalizeSlashes(RESOLVE),
                        extension: path.extname(RESOLVE)
                    };
                } catch (error) {
                    let RESOLVE = path.resolve(path.dirname(MODULES_IN) + "/" + MODUL)
                    if (fs.existsSync(RESOLVE)) {
                        return {
                            resolvedFileName: ts.normalizeSlashes(RESOLVE),
                            extension: path.extname(RESOLVE)
                        };
                    }

                    // if(path.extname(fileName) == ".css"){
                    //     return undefined
                    // }
                    // else if(){

                    // }
                    return 
                }


            })

            return new_module
        },
        directoryExists: function () {
            // console.log("directoryExists", arguments, directoryExists(...arguments))
            return directoryExists(...arguments)
        },
    }
}