const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Run_Compiler = require("../COMPILER/index");
// const APP_socket_connector = require("./APP");
const path = require('path');
// const SourceMap = require("../COMPILER/Create_SourceMap");
const ts = require("typescript")
const websock_controler = require("./websock_controler")
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
        
        return DEV_MODE_SCRIPT
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

        document.querySelectorAll("script[kix_app]").forEach(function ({ src }) {
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


                    DIAGNOSTICS_ERROR[URL.pathname] = File_DATA.DATA.SOCKET_ERRORS;
                    // console.log("restart", Math.random())
                    var file_code_SCRIPT = File_DATA.code
                    watch_directory[URL.pathname] = function () {
                        return file_code_SCRIPT
                    }
                }
                create_code_SCRIPT()

            } else {
                new Error(`NOT EXIST ${src} in ${runed_dir}`)

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
        console.error(new Error(`NOT EXIST index.html in ${runed_dir}`))
    }
    watch_directory['/'] = watch_directory['/index.html'] = function () {
        return index_HTML;
    }



















    // websock_controler

    var extrac_url = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi

    WS_Sock.on('connection', function (ws) {
        // DATA.Global_DATA.SOCKET_ERRORS.forEach(function (error) {
        //     ws.send(JSON.stringify(error))
        // })
        for (var error_path in DIAGNOSTICS_ERROR) {
            DIAGNOSTICS_ERROR[error_path].forEach(function (error) {
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

                        if (FILE && FILE.DATA.COMPIL_SCRIPT) {
                            const { line_coll: [error_line, error_column], error_cod } = element;
                            var Consumer = FILE.DATA.SourceMapConsumer = FILE.DATA.SourceMapConsumer || await new SourceMapConsumer(FILE.DATA.COMPIL_SCRIPT.sourceMapText)

                            const { line, column, source } = Consumer.originalPositionFor({
                                line: error_line,
                                column: error_column
                            });
                            // extrac_url

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