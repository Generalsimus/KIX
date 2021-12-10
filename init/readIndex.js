

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import ts, { resolvePath, normalizeSlashes, combinePaths } from "typescript"
import path from "path"
import fs from "fs"
import consola from "consola"
import chokidar from "chokidar"
import { JSDOM } from "jsdom"
import { CompileFile } from "./Compiler/CompileFile"
import { filePathToUrl, fixLibFileLocationInCompilerOptions, getoutFilePath } from "../helpers/utils"
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
                this.readJsDomHTML();
            }

            chokidar.watch(__IndexHTMLPath).on('all', watchChange)
        },

        readJsDomHTML() {

            // console.log("🚀 --> file: readIndex.js --> line 57 --> readJsDomHTML --> HTMLFilePaths", "HTMLFilePaths")
            const HtmlDom = new JSDOM(fs.readFileSync(__IndexHTMLPath, "utf8")),
                window = HtmlDom.window,
                document = window.document;
            document.body[document.body.firstElementChild ? "insertBefore" : "appendChild"](
                Object.assign(document.createElement('script'),
                    { src: __ModuleUrlPath }),
                document.body.firstElementChild
            )

            const htmFiles = new Set();

            const compilerOptions = fixLibFileLocationInCompilerOptions(__compilerOptions, __Host)
            const scriptTagInfos = Array.prototype.map.call(document.querySelectorAll('script[lang="kix"]'), (scriptElement, index) => {
                scriptElement.removeAttribute("lang");
                const ulrMeta = new window.URL(scriptElement.src, 'http://e'),
                    filePath = normalizeSlashes(path.join(__RunDirName, decodeURIComponent(ulrMeta.pathname))),
                    outFile = getoutFilePath(path.relative(__RunDirName, filePath));
                if (htmFiles.has(filePath)) {
                    scriptElement.remove()
                    return;
                }
                htmFiles.add(filePath);
                scriptElement.setAttribute("src", filePathToUrl(path.relative(App.__RunDirName, outFile)));

                return {
                    filePath,
                    compilerOptions: { ...compilerOptions, outFile }
                }
            });
            

            for (const { filePath, compilerOptions } of scriptTagInfos) {
                CompileFile(filePath, [...htmFiles], compilerOptions)
            }

            const INDEX_HTML_STRING = "<!DOCTYPE html> \n" + document.documentElement.outerHTML
            __IndexHTMLRequesPaths.forEach(INDEX_PATH => __requestsThreshold.set(INDEX_PATH, INDEX_HTML_STRING))

        },

    }
}