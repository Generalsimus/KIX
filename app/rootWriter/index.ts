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
            console.log("🚀 --> file: index.ts --> line 12 --> rootWriter --> App.requestsThreshold.set --> this", this);
            res.end(this.code);
        })
        // outPutFileName
    }
    writeFile(fileName: string, content: string) {
        // writeFile
    }
    writeJsCode(content: string) {
        // this.writeSafeCode(content)
        this.code += content.replace(this.sourceMapCommentRegExp, "");
    }
    writeSourceMap(fileName: string, content: string) {
        // writeSourceMap
    }
}