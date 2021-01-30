const ts = require("typescript")
const path = require("path")
const {
    Program_Host
} = require("../Transpile_Module")


module.exports = function (DATA) {
    const SourceFile = ts.createSourceFile(
        path.basename(DATA.Location),
        DATA.CODE_SCRIPT,
        ts.ScriptTarget.Latest);



    // CREATE ERRORS Diagnostics 
    for (var Diagnostic of SourceFile.parseDiagnostics) {
        const lineAndChar = Diagnostic.file.getLineAndCharacterOfPosition(
            Diagnostic.start
        );
        const line = lineAndChar.line + 1;
        const character = lineAndChar.character + 1;
        const FIX_path = DATA.Location.replace(DATA.Run_Dir, "").replace("\\", "/")

        

        DATA.ERRORS.push({
            data: [{
                code: DATA.CODE_SCRIPT,
                error_cod: `${Diagnostic.messageText} (${FIX_path}:${line}:${character})`,
                line_coll: [line, character],
                path: FIX_path,

            }],
            general_error: Diagnostic.messageText,
            method: "create_error_code"
        })

    }
    ////////////////////////////

    Object.assign(DATA, {
        SourceFile: SourceFile,
        // Diagnostics: SourceFile.parseDiagnostics,
        externalSource: DATA.File_Start_loc == DATA.Location ? false : ts.createSourceMapSource(
            DATA.Location.replace(DATA.Run_Dir, "").replace("\\", "/").slice(1),
            DATA.CODE_SCRIPT
        )
    })



    return SourceFile.statements
}