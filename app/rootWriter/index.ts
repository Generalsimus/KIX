import { App } from "..";
import { filePathToUrl } from "../../utils/filePathToUrl";
import { IRouterHandler, Request, Response } from "express";
import { createProgramHost } from "../createProgram";
import { emitPolyfills } from "./emitPolyfills";
import { number } from "yargs";

export class rootWriter {
    outFileName: string;
    code: string = ""
    sourceMapCommentRegExp = /\n\/\/[@#] source[M]appingURL=(.+)\r?\n?$/
    runCode: string
    constructor(outFileName: string, host: createProgramHost, emitFileIndexes: number[] = []) {
        // this.emitFileIndexes = emitFileIndexes
        this.outFileName = outFileName;
        this.runCode = emitFileIndexes.map(moduleIndex => `${App.uniqAccessKey}[${moduleIndex}]`).join("\n")
        emitPolyfills(this, host);

        App.requestsThreshold.set(filePathToUrl(this.outFileName), (req, res) => {

            res.end(`(function(${App.uniqAccessKey}){\n ${this.code}\n${this.runCode}\n})(window.${App.windowModuleLocationName} || (window.${App.windowModuleLocationName} = {}))`)
        })

    }
    writeJsCode(content: string) {
        //     console.log("🚀 --> file: index.ts --> line 21 --> rootWriter --> writeJsCode --> content", content);
        //    console.log( App.moduleThree.get(App.moduleControllerPath))
        //     console.log("🚀 --> file: index.ts --> line 26 --> rootWriter --> writeJsCode --> moduleControllerModuleInfo", this.moduleControllerModuleInfo);
        this.code += content.replace(this.sourceMapCommentRegExp, "");


    }
    writeSourceMap(fileName: string, content: string) {
        // writeSourceMap
    }
}