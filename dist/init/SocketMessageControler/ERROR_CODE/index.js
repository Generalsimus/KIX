"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODE = void 0;
const App_1 = require("../../../init/App");
const decode_1 = require("./decode");
const { __requestsThreshold } = App_1.App;
const ERROR_CODE = (errorData, socketClientSender) => {
    const mapFile = __requestsThreshold.get(errorData.path + ".map");
    if (mapFile) {
        const sourceMapObject = JSON.parse(mapFile);
        const decodedMappingsVlq = (0, decode_1.decode)(sourceMapObject.mappings);
        for (const lineGeneratedCodeIndexs in decodedMappingsVlq) {
            const lineGeneratedCode = parseInt(lineGeneratedCodeIndexs);
            const vlq = decodedMappingsVlq[lineGeneratedCode];
            let ifBreak = false;
            for (const [columnInGeneratedCode, correspondingSourceFile, LineNumberInOriginalCode, columnNumberInOriginalCode] of vlq) {
                if ((lineGeneratedCode + 1) === errorData.line) {
                    socketClientSender("ALERT_ERROR", {
                        errorData,
                        ...errorData,
                        fileCode: sourceMapObject.sourcesContent[correspondingSourceFile],
                        column: columnNumberInOriginalCode + 1,
                        line: LineNumberInOriginalCode + 1,
                    });
                    ifBreak = true;
                    break;
                }
            }
            if (ifBreak) {
                break;
            }
        }
    }
};
exports.ERROR_CODE = ERROR_CODE;
