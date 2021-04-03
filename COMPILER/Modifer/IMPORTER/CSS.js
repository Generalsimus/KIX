const path = require('path')
const fs = require('fs')
const ts = require('typescript')
const sass = require('sass')
const Clone_Json = require('../Clone_Json')
const consola = require('consola')
const factory = ts.factory
// console.log(require("typescript-plugin-css-modules"))
function RESOLVE_URL(url, { Run_Dir }, fileName) {
    var TEST_LOCAL_PATH = /^(\.)+[.\s]?(\/)/,
        FIX_URL = (url) => path.relative(Run_Dir, path.dirname(fileName) + "/" + url).replace(/\\/g, "/");

    if (TEST_LOCAL_PATH.test(url)) {
        url = FIX_URL(url)

        if (!TEST_LOCAL_PATH.test(url)) {
            url = "/" + url
        }
        return url
    } else if (url.startsWith('/')) {
        return url
    }

    url = URL.resolve("/", url)

    if (url.startsWith('/')) {
        return "/" + FIX_URL(url)
    }

    return url
}




function RESOLVE_QUOTES_URL(CODE_SCRIPT) {
    var STYLE = CODE_SCRIPT,
        reg = /(?![a-zA-Z]).(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
        exec_url,
        NEW_STYLE = "",
        START_INDEX = 0;
    while (exec_url = reg.exec(STYLE)) {
        NEW_STYLE += STYLE.slice(START_INDEX, exec_url.index + 1);
        START_INDEX = exec_url.index + exec_url[0].length;
        let url = exec_url[0].slice(5, -1)
        if (!/^[\"']+|[\"']+$/.test(url)) {
            url = `"${url}"`
        }
        NEW_STYLE += `url(${url})`

    }
    NEW_STYLE += STYLE.slice(START_INDEX)

    return NEW_STYLE
}




function CREATE_SASS(CONTENT, fileName, DATA, GET_METHOD, SourceFile) {
    try {
        var retsponse = sass.renderSync({
            file: fileName,
            // file: path.posix.basename(DATA.Location),
            data: RESOLVE_QUOTES_URL(CONTENT),
            // data: resolve_url(DATA),
            outputStyle: 'compressed',
            // indentedSyntax: true,
            importer: function (url, prev, done) {
                var PATH = path.resolve(path.dirname(fileName) + "/" + url)
                if (fs.existsSync(PATH)) {
                    return { file: PATH, contents: fs.readFileSync(PATH, "utf8") };
                }
                return { file: url, contents: undefined };
            },
            functions: {
                'url($filename)': function (filename) {
                    var url = RESOLVE_URL(filename.getValue().trim(), DATA, fileName)

                    return new sass.types.String(`url("${url}")`)
                }
            },
            outFile: fileName,
            sourceMapContents: GET_METHOD == "MAP" ? true : undefined,
            sourceMap: GET_METHOD == "MAP" ? true : undefined,
            // sourceMappingUrl :"ssd",
            // sourceMapEmbed: true
        });
    } catch (CSS_ERROR) {
        // consola.log(CSS_ERROR.message)
        // if(SourceFile){
        // var retsponse ={ css:CONTENT}
        // }
        // var retsponse =
        // retsponse.css= CONTENT
        return CSS_ERROR.message
    }

    // console.log(retsponse)
    return (GET_METHOD == "MAP" ? retsponse.map : retsponse.css).toString();
}




module.exports = function (fileName, DATA) {
    var CONTENT = fs.readFileSync(fileName, "utf8")


    // var result = 
    // result.css.toString()
    var SourceFile = ts.createSourceFile(
        fileName,
        "export default 's'",
        // 'export default "kk"',
        ts.ScriptTarget.ES2020,
        false,
        // 3
        ts.ScriptKind.JS
    )
    var RES_CSS = CREATE_SASS(CONTENT, fileName, DATA, "SASS", SourceFile)

    // console.log("RES_CSS", RES_CSS)
    // const factory = ts.factory;
    if (DATA.DEVELOPER_MOD) {
        var map_url = "/" + path.relative(DATA.Run_Dir, fileName).replace(/\\/g, "/") + ".map",
            MAP_TXT,
            STATE_CODE = {
                RES_CSS: RES_CSS,
                MAP: `\\n/*# sourceMappingURL=${map_url} */`
            }

        // `
        // var style=KD_(document.head,{style:""});exports.default=KD_(style,"${RES_CSS.replace(/\"/g, '\\"')}"),KD_(style,"\\n/*# sourceMappingURL=${map_url} */")
        // `;

        watch_directory[map_url] = function (res) {
            res.end(MAP_TXT || (MAP_TXT = CREATE_SASS(CONTENT, fileName, DATA, "MAP")));
            // return MAP_TXT || (MAP_TXT = CREATE_SASS(CONTENT, fileName, DATA, "MAP"))
        }
    } else {
        var STATE_CODE = {
            RES_CSS: RES_CSS,
            MAP: false
        }
        // var STATE_CODE = `
        // exports.default=KD_(KD_.style,"${RES_CSS.replace(/\"/g, '\\"')}");
        // `
    }


    //     ES3: 0,
    //   ES5: 1,
    //   ES2015: 2,
    //   ES2016: 3,
    //   ES2017: 4,
    //   ES2018: 5,
    //   ES2019: 6,
    //   ES2020: 7,
    //   ESNext: 99,
    //   JSON: 100,
    //   Latest: 99
    // console.log(ts.ScriptTarget)
    // Unknown: 0,
    // JS: 1,
    // JSX: 2,
    // TS: 3,
    // TSX: 4,
    // External: 5,
    // JSON: 6,
    // Deferred: 7

    // var stat = SourceFile.statements
    // SourceFile.text = CONTENT; 
    // SourceFile
    // SourceFile.statements = []
    // return SourceFile
    // STATE_CODE
    // SourceFile.end=CONTENT.length 
    return Object.assign(SourceFile, {
        STATE_CODE: STATE_CODE,
        // pos: 0,
        // end: 1,
        // scriptKind: ts.ScriptKind.JSON,
        // resolvedModules: undefined,
        // externalModuleIndicator: undefined,
        // exports: undefined,
        // imports: undefined,
        text: CONTENT,
        // statements: [
        //     factory.createExpressionStatement(factory.createObjectLiteralExpression(
        //       [factory.createShorthandPropertyAssignment(
        //         factory.createIdentifier("ss"),
        //         undefined
        //       )],
        //       false
        //     ))
        //   ],
        // statements: SourceFile.statements.map(node => {

        //     return ts.setSourceMapRange(ts.getMutableClone(node), {
        //         source: ts.createSourceMapSource(
        //             fileName.replace(DATA.Run_Dir, "").replace(/\\/g, "/").slice(1) + ".ml",
        //             CONTENT
        //         ),
        //         pos: node.pos,
        //         end: node.end
        //     })
        // })
    })
    // scriptKind
    // SourceFile.statements = 
    // return undefined

    // return 
    return SourceFile

}