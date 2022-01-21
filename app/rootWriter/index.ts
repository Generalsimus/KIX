import { App } from "..";
import { filePathToUrl } from "../../utils/filePathToUrl";

export class rootWriter {
    outFileName: string;
    code: string = ""
    sourceMapCommentRegExp = /\n\/\/[@#] source[M]appingURL=(.+)\r?\n?$/
    constructor(outFileName: string) {
        this.outFileName = outFileName;
        console.log("🚀 --> file: index.ts --> line 6 --> rootWriter --> constructor --> this.outFileName", filePathToUrl(this.outFileName));
        App.requestsThreshold.set(filePathToUrl(this.outFileName), (req, res) => {

            res.end(this.code);
        })
        console.log("🚀 --> file: index.ts --> line 15 --> rootWriter --> App.requestsThreshold.set --> App.requestsThreshold", App.requestsThreshold.keys());
        // outPutFileName
    }
    writeFile(fileName: string, content: string) {
        // writeFile
    }
    writeJsCode(content: string) {
        console.log("🚀 --> file: index.ts --> line 21 --> rootWriter --> writeJsCode --> content", content);
        // this.writeSafeCode(content)
        this.code += content.replace(this.sourceMapCommentRegExp, "");
        // console.log("🚀 --> file: index.ts --> line 23 --> rootWriter --> writeJsCode --> this.code", this);
    }
    writeSourceMap(fileName: string, content: string) {
        // writeSourceMap
    }
}