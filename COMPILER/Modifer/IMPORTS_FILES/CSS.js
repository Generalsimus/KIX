const ts = require("typescript")
const sass = require('node-sass')
const path = require("path")
const fs = require("fs")
const Clone_Json = require("../Clone_Json")
const URL = require('url');


function RESOLVE_URL(url, DATA) {
    var TEST_LOCAL_PATH = /^(\.)+[.\s]?(\/)/,
        FIX_URL = (url) => path.relative(DATA.Run_Dir, path.dirname(DATA.Location) + "/" + url).replaceAll("\\", "/");

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
module.exports = function (DATA) {

    // return [ts.createIdentifier(`RES_CSS`)]
    if (DATA.DEVELOPER_MOD) {


        try {
            var result = sass.renderSync({
                file: DATA.Location,
                // file: path.posix.basename(DATA.Location),
                data: RESOLVE_QUOTES_URL(DATA.CODE_SCRIPT),
                // data: resolve_url(DATA),
                outputStyle: 'compressed',
                // indentedSyntax: true,
                importer: function (url, prev, done) {
                    var PATH = path.resolve(path.dirname(DATA.Location) + "/" + url)
                    if (fs.existsSync(PATH)) {
                        return { file: PATH, contents: fs.readFileSync(PATH, "utf8") };
                    }
                    return { file: url, contents: undefined };
                },
                functions: {
                    'url($filename)': function (filename) {
                        var url = RESOLVE_URL(filename.getValue().trim(), DATA)

                        return new sass.types.String(`url("${url}")`)
                    }
                },
                outFile: 'o.css',
                sourceMapContents: true,
                sourceMap: true,
                sourceMapEmbed: true
            });
            var RES_CSS = result.css.toString()
        } catch (error) {
            var RES_CSS = " ",
                FILE_PATH = "/" + path.relative(DATA.Run_Dir, DATA.Location).replace("\\", "/");
            DATA.ERRORS.push({
                data: [
                    {
                        code: DATA.CODE_SCRIPT,
                        error_cod: `${error.message} (${FILE_PATH}:${error.line}:${error.column})`,
                        line_coll: [error.line, error.column],
                        path: FILE_PATH,

                    }
                ],
                general_error: error.message,
                method: "create_error_code"
            })
            // console.log()
        }


        return [
            Clone_Json.CREATE_Variable([Clone_Json.CREATE_Declaration('style',
                Clone_Json.CREATE_Call_FUNCTION("KD_", [
                    Clone_Json.CREATE_Call_FUNCTION("KD_", [
                        Clone_Json.CREATE_Access_Property(Clone_Json.CREATE_Identifier('document'), 'head'),
                        Clone_Json.CREATE_Object([
                            Clone_Json.CREATE_Property('style', Clone_Json.CREATE_TEXT(''))
                        ])
                        // Clone_Json.CREATE_TEXT(result.css.toString())
                    ]),
                    Clone_Json.CREATE_TEXT(RES_CSS.replace(/\r?\n?[^\r\n]*$/, ""))
                    // Clone_Json.CREATE_TEXT(result.css.toString())
                ])
            )]),
            Clone_Json.CREATE_Call_FUNCTION("KD_", [
                Clone_Json.CREATE_Access_Property(Clone_Json.CREATE_Identifier('style'), Clone_Json.CREATE_Call_FUNCTION('Parent', [])),
                Clone_Json.CREATE_TEXT(RES_CSS.match(/\r?\n?[^\r\n]*$/)[0])
                // Clone_Json.CREATE_Identifier(style)
            ]),
            Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_Identifier('style'))
            // Clone_Json.CREATE_Export('default', Clone_Json.CREATE_Identifier('style'))
        ]
    } else {
        var result = sass.renderSync({
            file: DATA.Location,
            // file: path.posix.basename(DATA.Location),
            data: RESOLVE_QUOTES_URL(DATA.CODE_SCRIPT),
            outputStyle: 'compressed',

            importer: function (url, prev, done) {
                var PATH = path.resolve(path.dirname(DATA.Location) + "/" + url)
                if (fs.existsSync(PATH)) {
                    return { file: PATH, contents: fs.readFileSync(PATH, "utf8") };
                }
                return { file: url, contents: undefined };
            },
            functions: {
                'url($filename)': function (filename) {
                    var url = RESOLVE_URL(filename.getValue().trim(), DATA)

                    return new sass.types.String(`url("${url}")`)
                }
            },
            // data: DATA.CODE_SCRIPT,
            outFile: 'o.css'
        });

        return [
            Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_Call_FUNCTION("KD_", [Clone_Json.CREATE_Identifier('KD_style'), Clone_Json.CREATE_TEXT(result.css.toString())]))
        ]
    }



    var RES_CSS = result.css.toString()
    console.log(RES_CSS)

    //  console.log(DATA.SourceFile.statements)
    // Clone_Json.CREATE_Access_Object_Property("exports", expo.name, (expo.propertyName || expo.name))
    return [ts.createIdentifier("ssds")]
}