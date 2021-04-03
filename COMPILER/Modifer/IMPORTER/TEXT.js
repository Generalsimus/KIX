const path = require("path");
const fs = require("fs");
const ts = require("typescript");
// const factory = ts.factory;
const Clone_Json = require("../Clone_Json")







module.exports = function (fileName) {

    var CONTENT = fs.readFileSync(fileName, "utf8");


    return Object.assign(ts.createSourceFile(
        path.basename(fileName),
        " ",
        ts.ScriptTarget.Latest,
        true
    ), {
        text: CONTENT,
        statements: [Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_TEXT(CONTENT))]
    })
}