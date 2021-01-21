const ts = require("typescript")
const Clone_Json = require("../Clone_Json")


module.exports = function (DATA) {

    return [Clone_Json.CREATE_Access_Object_Property("exports", "default", Clone_Json.CREATE_TEXT(DATA.CODE_SCRIPT))]
}