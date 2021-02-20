const Clone_Json = require("../Clone_Json")
const path = require("path")

module.exports = function (DATA) {

    // console.log(path.relative(DATA.Run_Dir, DATA.PARENT_Location))
    DATA.ERRORS.push({
        data: [{
            code: DATA.PARENT_CODE_SCRIPT,
            error_cod: "Error: Cannot find module: " + DATA.Import_Location,
            line_coll: [0, 0],
            path: DATA.Run_Dir && DATA.PARENT_Location ? path.relative(DATA.Run_Dir, DATA.PARENT_Location).replace(/\\/g, "/") : "undefined",

        }],
        general_error: "Error: Cannot find module: " + DATA.Import_Location,
        method: "create_error_code"
    })

    return [
        Clone_Json.CREATE_Call_Property("console", "error", [Clone_Json.CREATE_TEXT("Error: Cannot find module: " + DATA.Import_Location)])
    ]
}