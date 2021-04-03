const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const consola = require("consola")
const ts = require("typescript");
const CustomError = require("../COMPILER/Helpers/Custom_Error");
const CREATE_PROGRAM = require("../COMPILER/CREATE_PROGRAM");
const path = require('path');
const Chalk = require("chalk");
const HighLight = require("./HighLight")
const log_save = require("../COMPILER/Helpers/Console_save")




module.exports = function (runed_dir, WebSocket_URL) {
    global.watch_directory = {};
    // console.log(path.resolve(__dirname + "/JSkid/kid_script.js"))
    var index_location = runed_dir + '/index.html',
        DATA = {
            Run_Dir: runed_dir,
            Global_DATA: { IMPORTS_INDEX: 0 },
            Files_THRE: {},
            PROGRAMS: {},
            // MODULE_THRE: {},
            // FILE_MODULE_THRE: {},
            // STATEMENTS_LIST: {},
            // SAVE_MODULES: {
            //     kix: path.resolve(__dirname + "/JSkid/kid_script.js")
            // },
            DEVELOPER_MOD: true,
        },
        DIAGNOSTICS_ERROR = {};


    var DEV_MODE_SCRIPT = fs.readFileSync(__dirname + "/JSkid/kid_script.dev.js", "utf8").replace("${{{KIX_SCRIPT_CONTROLER_DEV_MODE}}}", WebSocket_URL);

    watch_directory['/KIX_SCRIPT_CONTROLER_DEV_MODE.js'] = function (res) {
        res.header("Cache-Control", "public, max-age=31536000");
        res.end(DEV_MODE_SCRIPT);
        // return
    }


    function create_index_HTML() {
        // console.save()

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
        document.querySelectorAll('script[lang="kix"]').forEach(function (ELEMENT, index) {

            var URL = new dom.window.URL(ELEMENT.src, 'http://e'),
                full_src = path.resolve(runed_dir + decodeURIComponent(URL.pathname)),
                HOST_LOCATION = [".ts", ".tsx"].includes(path.extname(full_src).toLocaleLowerCase()) ? full_src + ".js" : full_src,
                REQUEST_url = URL.pathname;

            if (fs.existsSync(full_src) && URL.pathname != "/") {
                ELEMENT.src = REQUEST_url;

                function create_code_SCRIPT() {
                    // var RESULT;
                    // PROGRAM,
                    // RESTART = function () {
                    //     RESULT = PROGRAM.getResult()
                    //     KD_RESTART_PAGE()
                    // },
                    // PROGRAM = CREATE_PROGRAM(full_src, {
                    //     ...DATA,
                    //     RESET_REQUEST_FILE: RESTART
                    // })

                    const HOST = DATA.PROGRAMS[full_src] || (DATA.PROGRAMS[full_src] = {
                        RESTART: function () {
                            this.PROGRAM.Emit()
                            KD_RESTART_PAGE()
                        },
                        PROGRAM: CREATE_PROGRAM(full_src, {
                            ...DATA,
                            HOST_LOCATION: HOST_LOCATION,
                            REQUEST_url: REQUEST_url,
                            RESET_REQUEST_FILE: function () {
                                let thisob = DATA.PROGRAMS[full_src]
                                thisob.RESULT = thisob.PROGRAM.Emit()
                                KD_RESTART_PAGE()
                            }
                        })
                    })
                    HOST.RESTART()
                    DIAGNOSTICS_ERROR[HOST_LOCATION] = HOST
                    // setInterval(() => {
                    //     RESTART()
                    // }, 1000)
                    // console.log(REQUEST_url)
                    watch_directory[URL.pathname] = function (res) {
                        res.end(HOST.PROGRAM.getCode())
                        // return 
                    }
                    watch_directory[URL.pathname + ".map"] = function (res) {
                        res.end(HOST.PROGRAM.getMap())
                        // return RESULT.Map
                    }
                }
                create_code_SCRIPT()

            } else {
                consola.error(`Error: Cannot find module: (${ELEMENT.src})`)

                // new Error(`NOT EXIST ${src} in ${runed_dir}`)

            }
        })



        return "<!DOCTYPE html> \n" + document.documentElement.outerHTML

    }



    // INDEX.HTML CREATOR
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
    watch_directory['/'] = watch_directory['/index.html'] = function (res) {
        res.end(index_HTML)
    }
    //////////////////////



























    // DIAGNOSTICS_ERROR
    WS_Sock.on('connection', function (ws) {


        for (var PATH in DIAGNOSTICS_ERROR) {
            // console.log(DIAGNOSTICS_ERROR[PATH].PROGRAM.getDiagnostics())
            // console.log(PATH)
            let getDiagnostics = DIAGNOSTICS_ERROR[PATH].PROGRAM.getDiagnostics();
            for (var DIAGNOSTIC of getDiagnostics) {
                // console.log(DIAGNOSTIC)
                if (DIAGNOSTIC.file) {
                    const { line, character } = DIAGNOSTIC.file.getLineAndCharacterOfPosition(
                        DIAGNOSTIC.start
                    );
                    // console.log(DIAGNOSTIC.file.originalFileName)
                    var PATH_relativ = path.relative(DATA.Run_Dir, DIAGNOSTIC.file.originalFileName).replace(/\\/g, "/")

                    var SPLITED = DIAGNOSTIC.file.text.split('\n').slice(line - 1, line + 3).join('\n')


                    consola.error(new CustomError(
                        DIAGNOSTIC.messageText,
                        undefined,
                        undefined,
                        `\nat (${PATH_relativ}:${line + 2}:${character + 1})` + "\n " +
                        HighLight(SPLITED).split('\n').map((v, index) => {

                            let leng = (String(line + 3).length - String(line + index).length)
                            let left_join = Array.from(Array(leng), x => " ").join("")
                            let checkLine = (index + line - 1) == line;



                            return Chalk[checkLine ? "redBright" : "grey"](left_join + (line + 1 + index) + '|' + (checkLine ? "> " : "  ")) + v
                        }).join('\n')
                    ))

                    ws.send(JSON.stringify({
                        general_error: DIAGNOSTIC.messageText,
                        method: "create_error_code",
                        data: [{
                            code: DIAGNOSTIC.file.text,
                            error_cod: `${DIAGNOSTIC.messageText} (${PATH_relativ}:${line + 1}:${character + 1})`,
                            line_coll: [line + 1, character + 1],
                            path: PATH_relativ,

                        }],
                        // line_coll
                    }))
                }
            }
            // const lineAndChar = Diagnostic.file.getLineAndCharacterOfPosition(
            //     Diagnostic.start
            // );

        }



        ws.on('message', function incoming(message) {
            var json_message = JSON.parse(message)

            // console.log(json_message)
            switch (json_message.method) {
                case "get_error_files":
                    // console.log(json_message)
                    // consola 
                    // Babel_HighLight
                    // consola.error(
                    var error_paths = []
                    json_message.data.forEach((v, index_) => {
                        // console.log(v)
                        // console.log(` at (${path.resolve(runed_dir + v.path)}:${v.line_coll[0]}:${v.line_coll[1]})`)
                        var RESOLVED_PATH = path.resolve(DATA.Run_Dir + "/" + v.path)

                        if (!(RESOLVED_PATH in DIAGNOSTICS_ERROR)) {
                            return []
                        }

                        const { PROGRAM } = DIAGNOSTICS_ERROR[RESOLVED_PATH]
                        const [LINE, COLLUMN] = v.line_coll
                        PROGRAM.getConsumer().then(function (Consumer) {
                            const { line, column, source } = Consumer.originalPositionFor({
                                line: LINE,
                                column: COLLUMN
                            })

                            // console.log(line, column, source)
                            if (line) {
                                error_paths.push({
                                    line,
                                    column,
                                    sourceTXT: Consumer.sourceContentFor(source),
                                    PATH: (path.relative(DATA.Run_Dir, path.join(path.dirname(RESOLVED_PATH), source))).replace(/\\/g, "/")
                                })
                                // error_paths.push(`\nat (${path.resolve(DATA.Run_Dir + "/" + v.path)}:${line}:${column})`)
                            }

                            if (index_ == json_message.data.length - 1 && error_paths.length) {
                                const { line, column, sourceTXT, PATH } = error_paths[0]
                                var SPLIT = sourceTXT.split('\n').slice(line - 2, line + 2)
                                var SPLITED = SPLIT.join('\n')
                                // console.log(URL_PATH)

                                // console.log(error_paths)

                                consola.error(new CustomError(
                                    json_message.general_error,
                                    undefined,
                                    undefined,
                                    error_paths.map(v => {
                                        return `\nat (${PATH}:${line}:${column})`
                                    }).join("") + "\n " +
                                    HighLight(SPLITED).split('\n').map((v, index) => {


                                        let leng = (String(line + 2).length - String(line + index - 1).length)
                                        let left_join = Array.from(Array(leng), x => " ").join("")
                                        let checkLine = (line + index - 1) == line;



                                        return Chalk[checkLine ? "redBright" : "grey"](left_join + (line + index - 1) + '|' + (checkLine ? "> " : "  ")) + v
                                    }).join('\n')

                                ))





                                ws.send(JSON.stringify({
                                    ...json_message,
                                    method: "create_error_code",
                                    data: error_paths.map(({ line, column, sourceTXT, PATH }) => {

                                        return {
                                            line_coll: [line, column],
                                            code: sourceTXT,
                                            error_cod: `\nat (${PATH}:${line}:${column})`
                                        }
                                    })
                                }))



                            }
                        })


                        // console.log(PROGRAM.getConsumer())
                        // return ` at (${path.resolve(DATA.Run_Dir + "/" + v.path)}:${v.line_coll[0]}:${v.line_coll[1]})`
                    })

                // new CustomError(
                //     json_message.general_error + "\n" + Babel_HighLight(`var s = 74`, { forceColor: true }),
                //     undefined,
                //     200,
                //     "\n " + json_message.data.map(v => {
                //         // console.log(` at (${path.resolve(runed_dir + v.path)}:${v.line_coll[0]}:${v.line_coll[1]})`)
                //         const [LINE, COLLUMN] = v.line_coll
                //         var RESOLVED_PATH = path.resolve(DATA.Run_Dir + "/" + v.path)
                //         const { PROGRAM } = DIAGNOSTICS_ERROR[RESOLVED_PATH]
                //         var CODE = PROGRAM.getCode()
                //         var LINES = CODE.split("\n").slice(0, LINE)
                //         var POP = LINES.pop()
                //         var POSITION = LINES.join("\n").length + POP.slice(0, COLLUMN)?.length
                //         console.log("LINES", POSITION)
                //         console.log(
                //             PROGRAM.getSourceMapper(),
                //             v.line_coll,
                //             PROGRAM.getSourceMapper().tryGetSourcePosition({ fileName: RESOLVED_PATH, pos: 0 }), POSITION
                //         )
                //         return ` at (${path.resolve(DATA.Run_Dir + "/" + v.path)}:${v.line_coll[0]}:${v.line_coll[1]})`
                //     }).join("\n")
                // )
                // )
                // console.log("sdfsdf\nsdfsdfs\rasdasdasda\rsdasd")
                // CustomError
            }

        })
    })



}