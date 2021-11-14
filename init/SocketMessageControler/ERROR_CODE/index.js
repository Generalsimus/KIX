import { App } from "../../../init/App"
import { decode } from "./decode"
const { __requestsThreshold } = App
export const ERROR_CODE = (errorData, socketClientSender) => {
    const mapFile = __requestsThreshold.get(errorData.path + ".map")
    if (mapFile) {
        const sourceMapObject = JSON.parse(mapFile)
        const decodedMappingsVlq = decode(sourceMapObject.mappings)
        for (const lineGeneratedCodeIndexs in decodedMappingsVlq) {
            const lineGeneratedCode = parseInt(lineGeneratedCodeIndexs);
            const vlq = decodedMappingsVlq[lineGeneratedCode];
            let ifBreak = false
            for (const [
                columnInGeneratedCode,
                correspondingSourceFile,
                LineNumberInOriginalCode,
                columnNumberInOriginalCode
            ] of vlq) {
                if ((lineGeneratedCode + 1) === errorData.line) {

                    socketClientSender("ALERT_ERROR", {
                        errorData,
                        ...errorData,
                        fileCode: sourceMapObject.sourcesContent[correspondingSourceFile],
                        column: columnNumberInOriginalCode + 1,
                        line: LineNumberInOriginalCode + 1,
                    })

                    ifBreak = true
                    break;
                }
            }
            if (ifBreak) {
                break;
            }
        }
    }

}