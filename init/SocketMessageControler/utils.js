import { filePathToUrl } from "../../Helpers/utils";
import { __compiledFilesThreshold } from "../Compiler/CompileFile"
import path from "path"
import { App } from "../App"
import { log, logError } from "../../Helpers/loger";
import { highlighter } from "../../Helpers/highlighter";
import Chalk from "chalk"

export const sendFileDiagnostics = (connectedWs, socketClientSender) => {
    let ifNoHaveError = true
    console.log("🚀 --> file: utils.js --> line 12 --> sendFileDiagnostics --> __compiledFilesThreshold", __compiledFilesThreshold)
    for (const [compiledFilePath, program] of __compiledFilesThreshold) {
        const diagnostics = getProgramDiagnostics(program);


        for (var diagnose of diagnostics) {
            if (diagnose.file) {
                ifNoHaveError = false

                const { line, character } = diagnose.file.getLineAndCharacterOfPosition(
                    diagnose.start
                );

                const errorInfo = {
                    path: filePathToUrl(path.relative(App.__RunDirName, diagnose.file.originalFileName)),
                    errorMessage: diagnose.messageText?.messageText || diagnose.messageText,
                    fileCode: diagnose.file.text,
                    column: character + 1,
                    line: line + 1,
                }

                logError({
                    messageText: errorInfo.errorMessage,
                    errorText: cutCodeForHigliting(errorInfo)
                })
                socketClientSender("ALERT_ERROR", errorInfo)
            }
        }

    }
    if (ifNoHaveError) {
        log({
            "\n√": "green",
            "Compiled successfully.": "green"
        })
    }
}




export const getProgramDiagnostics = (program) => {
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
}



export const cutCodeForHigliting = (errorInfo) => {
    const { line, column, path: filePath, fileCode } = errorInfo
    var SPLITED = fileCode.split('\n').slice(line - 1, line + 4).join('\n')

    return `\nat (${filePath}:${line}:${column})` + "\n " +
        highlighter(SPLITED).split('\n').map((v, index) => {

            let leng = (String(Math.max(line - 2, line + 2)).length - String(line + index).length)
            // console.log("🚀 --> file: utils.js --> line 91 --> highlighter --> leng", leng)
            let left_join = Array.from(Array(Math.max(0, leng)), x => " ").join("")



            return Chalk[index ? "grey" : "redBright"](left_join + ((line) + index) + '|' + (index ? "  " : "> ")) + v
        }).join('\n')
}