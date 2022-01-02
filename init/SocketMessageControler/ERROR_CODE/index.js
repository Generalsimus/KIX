import { highlighter } from "../../../helpers/highlighter"
import { logError } from "../../../helpers/loger"
import { App } from "../../../init/App"
import { cutCodeForHigliting } from "../utils"
import { decode } from "./decode"
const { __requestsThreshold } = App
export const ERROR_CODE = (errorData, socketClientSender) => {
    const mapFile = __requestsThreshold.get(errorData.path + ".map")
    let ifBreak = false
    if (mapFile) {
        // console.log("🚀 --> file: index.js --> line 12 --> mapFile", errorData.path)
        // console.log("🚀 --> file: index.js --> line 12 --> mapFile", mapFile)
        const sourceMapObject = JSON.parse(mapFile)
        const decodedMappingsVlq = decode(sourceMapObject.mappings)
        for (const lineGeneratedCodeIndexs in decodedMappingsVlq) {
            const lineGeneratedCode = parseInt(lineGeneratedCodeIndexs);
            const vlq = decodedMappingsVlq[lineGeneratedCode];

            for (const [
                columnInGeneratedCode,
                correspondingSourceFile,
                LineNumberInOriginalCode,
                columnNumberInOriginalCode
            ] of vlq) {
                if ((lineGeneratedCode + 1) === errorData.line) {
                    const errorInfo = {
                        errorData,
                        ...errorData,
                        fileCode: sourceMapObject.sourcesContent[correspondingSourceFile],
                        column: columnNumberInOriginalCode + 1,
                        line: LineNumberInOriginalCode + 1,
                    }
                    logError({
                        messageText: errorInfo.errorMessage,
                        errorText: cutCodeForHigliting(errorInfo)
                    })
                    socketClientSender("ALERT_ERROR", errorInfo)

                    ifBreak = true
                    break;
                }
            }
            if (ifBreak) {
                break;
            }
        }
    }

    const jsFile = __requestsThreshold.get(errorData.path)
    if (!ifBreak && jsFile) {
        socketClientSender("ALERT_ERROR", {
            errorData,
            ...errorData,
            fileCode: jsFile,
        })
    }
}