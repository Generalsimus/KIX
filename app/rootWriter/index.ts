import { App } from "..";
import { decode, SourceMapMappings } from 'sourcemap-codec';
import { createCode } from "./createCode";
import { createProgramHost } from "../createProgram";
import { emitPolyfills } from "./emitPolyfills";
import { createRequestListeners } from "./createRequestListeners";
import { filePathToUrl } from "../../utils/filePathToUrl";
import { getMapUrl } from "./utils/getMapUrl";
import { createMapCode } from "./createMapCode";
import { getCodeSource } from "./getCodeSource";

export class rootWriter {
    outFileName: string;
    requestPath: string;
    isNodeModules: boolean;
    injectCode: string = ""
    codeByFileName: Record<string, {
        code: string,
        decodedMappings: SourceMapMappings
        sourceMapNames: string[];
    }> = {}
    sourceMapCommentRegExp = /\n\/\/[@#] source[M]appingURL=(.+)\r?\n?$/
    host: createProgramHost
    responseJSCode: string | undefined
    responseMAPCode: string | undefined
    runCode: string
    constructor(outFileName: string, host: createProgramHost, emitFileIndexes: number[] = [], isNodeModules: boolean = false) {
        this.host = host;
        this.outFileName = outFileName;
        this.isNodeModules = isNodeModules;
        this.requestPath = filePathToUrl(outFileName);
        this.runCode = emitFileIndexes.map(moduleIndex => `${App.uniqAccessKey}[${moduleIndex}]`).join("\n")
        emitPolyfills(this, host);

        this.createRequestListeners();
    }
    getCodeSource = getCodeSource
    createRequestListeners = createRequestListeners
    createCode = createCode
    createMapCode = createMapCode
    writeJsCode(fileName: string | undefined, content: string) {
        this.responseJSCode = undefined;
        this.responseMAPCode = undefined;
        content = content.replace(this.sourceMapCommentRegExp, "");
        if (fileName) {
            const codeSource = this.getCodeSource(fileName)
            codeSource.code = content
        } else {
            this.injectCode += content;
        }
    }
    writeSourceMap(fileName: string, content: string) {
        this.responseMAPCode = undefined;
        try {
            const sourceMap = JSON.parse(content);
            const decodedMappings = decode(sourceMap.mappings);
            const codeSource = this.getCodeSource(fileName)
            codeSource.decodedMappings = decodedMappings;
            codeSource.sourceMapNames = sourceMap.names;

        } catch (e) {

        }

    }
}