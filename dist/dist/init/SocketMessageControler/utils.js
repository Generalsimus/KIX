"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutCodeForHigliting = exports.getProgramDiagnostics = exports.sendFileDiagnostics = void 0;
const utils_1 = require("../../Helpers/utils");
const CompileFile_1 = require("../Compiler/CompileFile");
const path_1 = __importDefault(require("path"));
const App_1 = require("../App");
const loger_1 = require("../../Helpers/loger");
const highlighter_1 = require("../../Helpers/highlighter");
const chalk_1 = __importDefault(require("chalk"));
const sendFileDiagnostics = (connectedWs, socketClientSender) => {
    let ifNoHaveError = true;
    for (const [compiledFilePath, program] of CompileFile_1.__compiledFilesThreshold) {
        const diagnostics = (0, exports.getProgramDiagnostics)(program);
        for (var diagnose of diagnostics) {
            if (diagnose.file) {
                ifNoHaveError = false;
                const { line, character } = diagnose.file.getLineAndCharacterOfPosition(diagnose.start);
                const errorInfo = {
                    path: (0, utils_1.filePathToUrl)(path_1.default.relative(App_1.App.__RunDirName, diagnose.file.originalFileName)),
                    errorMessage: diagnose.messageText?.messageText || diagnose.messageText,
                    fileCode: diagnose.file.text,
                    column: character + 1,
                    line: line + 1,
                };
                (0, loger_1.logError)({
                    messageText: errorInfo.errorMessage,
                    errorText: (0, exports.cutCodeForHigliting)(errorInfo)
                });
                socketClientSender("ALERT_ERROR", errorInfo);
            }
        }
    }
    if (ifNoHaveError) {
        (0, loger_1.log)({
            "\n√": "green",
            "Compiled successfully.": "green"
        });
    }
};
exports.sendFileDiagnostics = sendFileDiagnostics;
const getProgramDiagnostics = (program) => {
    // console.log("🚀 --> file: utils.js --> line 22 --> getProgramDiagnostics --> program", program)
    // const diagnostics = []; 
    // for (const sourceFile of program.getSourceFiles()) {
    //     if (!sourceFile.isDeclarationFile) {
    //         diagnostics.push(...sourceFile.parseDiagnostics);
    //         diagnostics.push(...sourceFile.semanticDiagnostics);
    //         diagnostics.push(...sourceFile.syntacticDiagnostics);
    //     }
    // }
    // return Object.entries(program).flatMap(([key, value]) => {
    //     console.log("🚀 --> file: utils.js --> line 46 --> returnObject.entries --> key", key.includes("Diagnostics"), key)
    //     if (key.includes("Diagnostics") && ![
    //         "getSuggestionDiagnostics",
    //         "getBindAndCheckDiagnostics",
    //         "getProgramDiagnostics",
    //         "getCachedSemanticDiagnostics",
    //         "getDiagnosticsProducingTypeChecker",
    //         "getFileProcessingDiagnostics",
    //     ].includes(key)) {
    //         return value()
    //     }
    //     return []
    // })
    return [
        ...program.getSemanticDiagnostics(),
        ...program.getSyntacticDiagnostics(),
    ];
};
exports.getProgramDiagnostics = getProgramDiagnostics;
const cutCodeForHigliting = (errorInfo) => {
    const { line, column, path: filePath, fileCode } = errorInfo;
    var SPLITED = fileCode.split('\n').slice(line - 1, line + 4).join('\n');
    return `\nat (${filePath}:${line}:${column})` + "\n " +
        (0, highlighter_1.highlighter)(SPLITED).split('\n').map((v, index) => {
            let leng = (String(Math.max(line - 2, line + 2)).length - String(line + index).length);
            // console.log("🚀 --> file: utils.js --> line 91 --> highlighter --> leng", leng)
            let left_join = Array.from(Array(Math.max(0, leng)), x => " ").join("");
            return chalk_1.default[index ? "grey" : "redBright"](left_join + ((line) + index) + '|' + (index ? "  " : "> ")) + v;
        }).join('\n');
};
exports.cutCodeForHigliting = cutCodeForHigliting;
