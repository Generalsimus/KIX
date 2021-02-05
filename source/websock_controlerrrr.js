const path = require("path")
const { SourceMapConsumer } = require("source-map")



var extrac_url = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi

module.exports = function (DATA, WS_Sock, runed_dir) {
    WS_Sock.on('connection', function (ws) {
        DATA.Global_DATA.SOCKET_ERRORS.forEach(function (error) {
            ws.send(JSON.stringify(error))
        })

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

                            console.log(element, error_cod.replace(extrac_url, `/${path.relative(DATA.Run_Dir, new_PATH)}:${line}:${column}`))

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

}