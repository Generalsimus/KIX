const Clone_Json = require("../Clone_Json")

module.exports = function (DATA) {

    return [
        Clone_Json.CREATE_Call_Property("console", "error", [Clone_Json.CREATE_TEXT("Error: Cannot find module: " + DATA.Import_Location)])
    ]
}