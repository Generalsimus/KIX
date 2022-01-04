"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODE = void 0;
const loger_1 = require("../../../helpers/loger");
const App_1 = require("../../../init/App");
const utils_1 = require("../utils");
const decode_1 = require("./decode");
const { __requestsThreshold } = App_1.App;
const ERROR_CODE = (errorData, socketClientSender) => {
    const mapFile = __requestsThreshold.get(errorData.path + ".map");
    let ifBreak = false;
    if (mapFile) {
        const sourceMapObject = JSON.parse(mapFile);
        const decodedMappingsVlq = (0, decode_1.decode)(sourceMapObject.mappings);
        for (const lineGeneratedCodeIndexs in decodedMappingsVlq) {
            const lineGeneratedCode = parseInt(lineGeneratedCodeIndexs);
            const vlq = decodedMappingsVlq[lineGeneratedCode];
            for (const [columnInGeneratedCode, correspondingSourceFile, LineNumberInOriginalCode, columnNumberInOriginalCode] of vlq) {
                if ((lineGeneratedCode + 1) === errorData.line) {
                    const errorInfo = Object.assign(Object.assign({ errorData }, errorData), { fileCode: sourceMapObject.sourcesContent[correspondingSourceFile], column: columnNumberInOriginalCode + 1, line: LineNumberInOriginalCode + 1 });
                    (0, loger_1.logError)({
                        messageText: errorInfo.errorMessage,
                        errorText: (0, utils_1.cutCodeForHigliting)(errorInfo)
                    });
                    socketClientSender("ALERT_ERROR", errorInfo);
                    ifBreak = true;
                    break;
                }
            }
            if (ifBreak) {
                break;
            }
        }
    }
    const jsFile = __requestsThreshold.get(errorData.path);
    if (!ifBreak && jsFile) {
        socketClientSender("ALERT_ERROR", Object.assign(Object.assign({ errorData }, errorData), { fileCode: jsFile }));
    }
};
exports.ERROR_CODE = ERROR_CODE;
