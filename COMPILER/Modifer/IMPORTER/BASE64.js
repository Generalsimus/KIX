const ts = require("typescript")
const mime = require("mime-types")
const path = require("path")
const fs = require("fs")


module.exports = (fileName ) => {


    return ts.createSourceFile(
        path.basename(fileName),
        `export default "data:${mime.lookup(fileName)};base64,${fs.readFileSync(fileName, { encoding: 'base64' })}  "`,
        ts.ScriptTarget.Latest,
        true
    )
}