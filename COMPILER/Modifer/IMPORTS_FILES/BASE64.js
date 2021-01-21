const mime = require("mime-types")
const Clone_Json = require("../Clone_Json")
const fs = require("fs")


module.exports = function (DATA) {

    return [
        Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_TEXT(`data:${mime.lookup(DATA.Location)};base64,${fs.readFileSync(DATA.Location, { encoding: 'base64' })}`))
    ]
}