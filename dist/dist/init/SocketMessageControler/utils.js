"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFileDiagnostics = void 0;
const utils_1 = require("../../Helpers/utils");
const CompileFile_1 = require("../Compiler/CompileFile");
const path_1 = __importDefault(require("path"));
const App_1 = require("../App");
const sendFileDiagnostics = (connectedWs, socketClientSender) => {
    for (const [compiledFilePath, program] of CompileFile_1.__compiledFilesThreshold) {
        const diagnostics = getProgramDiagnostics(program);
        for (var diagnose of diagnostics) {
            if (diagnose.file) {
                // console.log("🚀 --> file: utils.js --> line 12 --> sendFileDiagnostics --> diagnose.file", diagnose.file)
                const { line, character } = diagnose.file.getLineAndCharacterOfPosition(diagnose.start);
                socketClientSender("ALERT_ERROR", {
                    path: (0, utils_1.filePathToUrl)(path_1.default.relative(App_1.App.__RunDirName, diagnose.file.originalFileName)),
                    errorMessage: diagnose.messageText,
                    fileCode: diagnose.file.text,
                    column: character + 1,
                    line: line + 1,
                });
            }
        }
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
    return [
        ...program.getSemanticDiagnostics(),
        ...program.getSyntacticDiagnostics(),
    ];
};
