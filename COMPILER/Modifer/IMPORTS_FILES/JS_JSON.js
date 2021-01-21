const ts = require("typescript")
const Clone_Json = require("../Clone_Json")

// console.log(ts.ScriptTarget)
module.exports = function (DATA) {

    Object.assign(DATA, {
        SourceFile: ts.createSourceFile(
            "APP.json",
            DATA.CODE_SCRIPT,
            ts.ScriptTarget.JSON),
        externalSource: ts.createSourceMapSource(
            DATA.Location.replace(DATA.Run_Dir, "").replace("\\", "/").slice(1),
            DATA.CODE_SCRIPT
        )
    })


    return [Clone_Json.CREATE_Access_Object_Property("exports", "default", DATA.SourceFile.statements[0].expression)]
}