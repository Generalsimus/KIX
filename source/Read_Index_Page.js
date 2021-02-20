const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const consola = require("consola")

const CustomError = require("../COMPILER/Helpers/Custom_Error");
const Run_Compiler = require("../COMPILER/index");
// const APP_socket_connector = require("./APP");
const path = require('path');
// const SourceMap = require("../COMPILER/Create_SourceMap");
// const ts = require("typescript")
// const websock_controler = require("./websock_controler")

// const { decode } = require('sourcemap-codec');
const { SourceMapConsumer } = require("source-map")


module.exports = function (runed_dir, WebSocket_URL) {
    global.watch_directory = {};

    var index_location = runed_dir + '/index.html',
        DATA = {
            Run_Dir: runed_dir,
            Global_DATA: { IMPORTS_INDEX: 0 },
            Files: {},
            // WATCH_FILES: {},
            DEVELOPER_MOD: true,
        },
        DIAGNOSTICS_ERROR = {};


    var DEV_MODE_SCRIPT = fs.readFileSync(__dirname + "/JSkid/kid_script.dev.js", "utf8").replace("${{{KIX_SCRIPT_CONTROLER_DEV_MODE}}}", WebSocket_URL);

    watch_directory['/KIX_SCRIPT_CONTROLER_DEV_MODE.js'] = function (res) {
        res.header("Cache-Control", "public, max-age=31536000");

        return fs.readFileSync(__dirname + "/JSkid/kid_script.dev.js", "utf8").replace("${{{KIX_SCRIPT_CONTROLER_DEV_MODE}}}", WebSocket_URL)
    }


    function create_index_HTML() {
        console.save()

        global.watch_directory = {
            "/": watch_directory['/'],
            "/index.html": watch_directory['/'],
            '/KIX_SCRIPT_CONTROLER_DEV_MODE.js': watch_directory['/KIX_SCRIPT_CONTROLER_DEV_MODE.js']
        };


        var dom = new JSDOM(fs.readFileSync(index_location, "utf8")),
            document = dom.window.document;
        DIAGNOSTICS_ERROR = {};


        // APP_socket_connector(WebSocket_URL)    
        document.head[document.head.firstElementChild ? "insertBefore" : "appendChild"](
            Object.assign(document.createElement('script'),
                { src: `http://${WebSocket_URL}/KIX_SCRIPT_CONTROLER_DEV_MODE.js` }),
            document.head.firstElementChild
        )
        // document.head.appendChild(node_script())
        global.LOCKED_FILES = []
        document.querySelectorAll('script[lang="kix"]').forEach(function ({ src }, index) {
            var URL = new dom.window.URL(src, 'http://e'),
                full_src = path.resolve(runed_dir + URL.pathname);

            // var file_code_SCRIPT = `ERROR: ${full_src} not found`

            // watch_directory[URL.pathname] = function () {
            //     return file_code_SCRIPT
            // }
            // console.log(src, URL.pathname, full_src)
            if (fs.existsSync(full_src) && URL.pathname != "/") {


                function create_code_SCRIPT() {
                    var File_DATA = Run_Compiler({
                        ...DATA,
                        RESET_REQUEST_FILE: create_code_SCRIPT
                    }, full_src)

                    // console.log(File_DATA.DATA.LOCKED_FILES)
                    LOCKED_FILES[index] = File_DATA.DATA.LOCKED_FILES
                    DIAGNOSTICS_ERROR[URL.pathname] = File_DATA.DATA.SOCKET_ERRORS;
                    // console.log("restart", Math.random())
                    var file_code_SCRIPT = File_DATA.code
                    watch_directory[URL.pathname] = function () {
                        return file_code_SCRIPT
                    }
                }
                create_code_SCRIPT()

            } else {
                consola.error(`Error: Cannot find module: (${src})`)

                // new Error(`NOT EXIST ${src} in ${runed_dir}`)

            }
        })



        return "<!DOCTYPE html> \n" + document.documentElement.outerHTML

    }

    var index_HTML = "ERROR: index.html not found" + runed_dir;
    if (fs.existsSync(index_location)) {
        index_HTML = create_index_HTML();

        fs.watch(index_location, () => {
            index_HTML = create_index_HTML()
            KD_RESTART_PAGE()
        })
    } else {
        consola.error(`NOT EXIST index.html in ${runed_dir}`)
        // console.error(new Error(`NOT EXIST index.html in ${runed_dir}`))
    }
    watch_directory['/'] = watch_directory['/index.html'] = function () {
        return index_HTML;
    }



















    // websock_controler

    var extrac_url = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi

    var Consumer,
        source_map;
    WS_Sock.on('connection', function (ws) {
        // DATA.Global_DATA.SOCKET_ERRORS.forEach(function (error) {
        //     ws.send(JSON.stringify(error))
        // })
        for (var error_path in DIAGNOSTICS_ERROR) {

            // consola.error(
            //     new CustomError(
            //         send_Object.general_error,
            //         undefined,
            //         200,
            //         "\n " + send_Object.data.map(v => {
            //             return ` at (${v.path}:${v.line_coll[0]}:${v.line_coll[1]})`
            //         }).join("\n")
            //     )
            // )

            DIAGNOSTICS_ERROR[error_path].forEach(function (error) {
                // console.log(error)
                consola.error(
                    new CustomError(
                        error.general_error,
                        undefined,
                        200,
                        "\n " + error.data.map(v => {
                            return ` at (${v.path}:${v.line_coll[0]}:${v.line_coll[1]})`
                        }).join("\n")
                    )
                )
                ws.send(JSON.stringify(error))
            })
        }


        // console.log(DIAGNOSTICS_ERROR)
        ws.on('message', function incoming(message) {
            var json_message = JSON.parse(message)

            switch (json_message.method) {
                case "get_error_files":

                    var send_Object = {
                        ...json_message,
                        method: "create_error_code",
                        data: []
                    }



                    json_message.data.forEach(async function (element, index) {
                        var PATH_FILE = path.resolve(runed_dir + element.path),
                            FILE = DATA.Files[PATH_FILE];

                        // console.log(PATH_FILE, Object.keys(DATA.Files))
                        if (FILE && FILE.DATA.COMPIL_SCRIPT) {
                            const { line_coll: [error_line, error_column], error_cod } = element;

                            // decode
                            let sourceMapText = FILE.DATA.COMPIL_SCRIPT.sourceMapText
                            Consumer = source_map == sourceMapText ? Consumer : await new SourceMapConsumer(FILE.DATA.COMPIL_SCRIPT.sourceMapText)
                            // decoded_vql = source_map == sourceMapText ? decoded_vql : decode(JSON.parse(sourceMapText).mappings)
                            source_map = sourceMapText
                            // if()
                            // var decoded_vql = FILE.DATA.SourceMap_VQL || (FILE.DATA.SourceMap_VQL = decode(JSON.parse(FILE.DATA.COMPIL_SCRIPT.sourceMapText).mappings))
                            const { line, column, source } = Consumer.originalPositionFor({
                                line: error_line,
                                column: error_column
                            });

                            // const [ERROR_COLLUMN, SOURCES_INDEX, ORIGINAL_LINE, ORIGINAL_COLL] = decoded_vql[error_line].reduce((v1, v2) => {

                            //     // console.log(v1[0], v2[0], v1[0] == v2[0] ? v2 : (v1[0] > v2[0] ? v2 : v1))

                            //     return v1[0] == error_column ? v1 : (v2[0] == error_column) ? v2 : (v1[0] > v2[0] ? v2 : v1)
                            // })
                            // console.log(line, column, decoded_vql[error_line],  error_line, error_column)
                            // extrac_url
                            // console.log(error_line, error_column, line, column)
                            var new_PATH = path.resolve(path.dirname(PATH_FILE) + "/" + source)

                            // console.log(element, error_cod.replace(extrac_url, `/${path.relative(DATA.Run_Dir, new_PATH)}:${line}:${column}`))

                            if (line != null) {
                                send_Object.data.push(Object.assign(element, {
                                    line_coll: [line, column],
                                    code: DATA.Files[new_PATH].DATA.CODE_SCRIPT,
                                    error_cod: error_cod.replace(extrac_url, `/${path.relative(DATA.Run_Dir, new_PATH)}:${line}:${column}`)
                                }))
                            }

                            if (index == json_message.data.length - 1 && send_Object.data.length) {
                                // console.log(send_Object )
                                // general_error:

                                consola.error(
                                    new CustomError(
                                        send_Object.general_error,
                                        undefined,
                                        200,
                                        "\n " + send_Object.data.map(v => {
                                            // console.log(` at (${path.resolve(runed_dir + v.path)}:${v.line_coll[0]}:${v.line_coll[1]})`)
                                            return ` at (${v.path}:${v.line_coll[0]}:${v.line_coll[1]})`
                                        }).join("\n")
                                    )
                                )

                                ws.send(JSON.stringify(send_Object))
                            }
                        }
                    })

                    break;
            }
        });
    });

    ////////////////////


}