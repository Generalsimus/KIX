

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import ts, { resolvePath, normalizeSlashes, combinePaths } from "typescript"
import path from "path"
import fs from "fs"
import consola from "consola"
import chokidar from "chokidar"
import { JSDOM } from "jsdom"
import { CompileFile } from "./Compiler/CompileFile"
import { fixLibFileLocationInCompilerOptions } from "../Helpers/utils"
import { __compiledFilesThreshold } from "./Compiler/CompileFile"


export const ReadIndexHTML = (App) => {
    const { __requestsThreshold, __RunDirName, __ModuleUrlPath, __Host, __compilerOptions, __IndexHTMLRequesPaths } = App
    const __IndexHTMLPath = path.resolve("./index.html")


    if (!fs.existsSync(__IndexHTMLPath)) {
        throw consola.error("Couldn't find index.html'")
    }
    return {
        watchIndexHTML() {
            const watchChange = () => {
                __compiledFilesThreshold.clear();
                __requestsThreshold.clear();
            }
            // chokidar.watch(__IndexHTMLPath).on('add', watchChange).on('change', watchChange).on('unlink', () => watchChange);.
            chokidar.watch(__IndexHTMLPath).on('all', watchChange)
        },

        readJsDomHTML() {
            const HtmlDom = new JSDOM(fs.readFileSync(__IndexHTMLPath, "utf8")),
                window = HtmlDom.window,
                document = window.document;
            document.body[document.body.firstElementChild ? "insertBefore" : "appendChild"](
                Object.assign(document.createElement('script'),
                    { src: __ModuleUrlPath }),
                document.body.firstElementChild
            )


            const HTMLFilePaths = Array.prototype.map.call(document.querySelectorAll('script[lang="kix"]'), (ELEMENT, index) => {
                var UrlMeta = new window.URL(ELEMENT.src, 'http://e'),
                    FilePath = normalizeSlashes(path.join(__RunDirName, decodeURIComponent(UrlMeta.pathname)));

                return FilePath

            });
            const compilerOptions = fixLibFileLocationInCompilerOptions(__compilerOptions, __Host)
            // Compiler(FilePath)
            HTMLFilePaths.forEach(FilePath => CompileFile(FilePath, HTMLFilePaths, compilerOptions));

            const INDEX_HTML_STRING = "<!DOCTYPE html> \n" + document.documentElement.outerHTML
            __IndexHTMLRequesPaths.forEach(INDEX_PATH => __requestsThreshold.set(INDEX_PATH, INDEX_HTML_STRING))

        },
        // readIndexHTML() {
        //     if (fs.existsSync(__IndexHTMLPath)) {
        //         return fs.readFileSync(__IndexHTMLPath, "utf8")
        //     }

        // }
    }
}