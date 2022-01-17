import ts from "typescript"
import { App } from "../";
import { getTransformer } from "../../transform";
import { fileNameToUrlPath } from "../../utils/fileNameToUrlPath";

const transformer = getTransformer()
export const getRootWriter = (rootFileName: string, WriterProgram: ts.Program) => {
    // const sources = {}
    // customResponse
    // const requestPath = fileNameToUrlPath(rootFileName)
    var printer = ts.createPrinter({}, {
        // resolver hooks
        // hasGlobalName: resolver.hasGlobalName,
        // // transform hooks
        // onEmitNode: transform.emitNodeWithNotification,
        // isEmitNotificationEnabled: transform.isEmitNotificationEnabled,
        // substituteNode: transform.substituteNode,
    });
    const writerObject = {
        text: '',
        rootFileName,
        requestPath: fileNameToUrlPath(rootFileName),
        // outPutFileName: '',
        sourceMap: {
            version: 3,
            sources: [],
            names: [],
            mappings: "CAAA",
            sourcesContent: [],
            file: "app.js",
        },
        writeSourceFile(sourceFile: ts.SourceFile) {
            // ts.write(sourceFile)
            console.log("🚀 --> file: getRootWriter.ts --> line 18 --> writeSourceFile --> sourceFile", sourceFile.fileName);
            // sourceFile.fileName
            // WriterProgram.emit(sourceFile)
            // modifiers
            // console.log(Object.keys(sourceFile).sort())
            // WriterProgram.emit(sourceFile, (fileName: string, content: string) => {
            //     if (fileName.endsWith(".js")) {
            //         this.text += content;
            //         console.log("🚀 --> BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            //         console.log("🚀 --> file: this.text\n", this.text);
            //     } else if (fileName.endsWith(".map")) {
            //         const map = JSON.parse(content)
            //         // sources[fileName] = map
            //     }
            //     // console.log(fileName, content)
            // },
            //     undefined,
            //     undefined,
            //     undefined,
            //     // transformer
            // )
        }
    }



    App.requestsThreshold.set(writerObject.requestPath, (_, res) => res.end(writerObject.text));

    return writerObject
}