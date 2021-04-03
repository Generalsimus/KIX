const express = require('express');
const app = express();
const WebSocket = require("ws").Server;
const http = require("http")
const path = require("path")
const server = http.createServer(app);
const open = require("open");
const Read_Index_Page = require("./Read_Index_Page")
const consola = require("consola")
const mime = require('mime-types')



var WS = new WebSocket({ server, path: "/KD/K_KD_Socket_KD_K" });


module.exports = function (runed_dir) {


    Object.assign(global, {
        WS_Sock: WS,
        KD_RESTART_PAGE: function () {
            console.save()
            WS.clients.forEach(ws => {
                if (ws.readyState == 1) {
                    ws.send(JSON.stringify({
                        method: "restart_page",
                    }))
                }
            })
        },
        WS_SEND: function (object) {
            // console.log(object)
            WS.clients.forEach(ws => {
                if (ws.readyState == 1) {
                    ws.send(JSON.stringify(object))
                }
            })
        }
    })
    // global.watch_directory = {};


    app.use(function (req, res, next) {

        res.header("Cache-Control", "no-cache");


        // console.log(req._parsedUrl.pathname)
        var V_Dir = watch_directory[req._parsedUrl.pathname];
        if (V_Dir) {
            res.header("content-type", mime.lookup(req._parsedUrl.pathname) || "text/html");
            // res.end()
            V_Dir(res)
        } else {
            // console.log(req._parsedUrl.pathname)
            next();
        }

    });

    // app.use(function (req, res, next) {

    //     // console.log(path.resolve(runed_dir + "/" + req._parsedUrl.pathname))
    //     const request_file = path.resolve(runed_dir + "/" + req._parsedUrl.pathname)
    //     // console.log(LOCKED_FILES)
    //     for (var file of LOCKED_FILES) {
    //         if (request_file in file) {
    //             consola.error(`File Already Imported (${req._parsedUrl.pathname})`)
    //             res.end(`File Already Imported (${req._parsedUrl.pathname})`)
    //             return;
    //         }
    //     }
    //     next();


    // });
    app.use("/", express.static(runed_dir));

    app.use(function (req, res) {
        watch_directory["/"](res)
        // res.end(watch_directory["/"]())
    });

    const listener = server.listen(COMMANDS.PORT || 0, () => {
        var url = `localhost:${listener.address().port}`,
            http_url = `http://${url}`;
        Read_Index_Page(runed_dir, url);
        open(http_url);
        // console.log(http_url)
        console.save(`\nYou can now view in the browser: `, "white", http_url, 'blue', `\nTo create a production build, use: `, "white", 'npm build', 'blue')

        // console.log('\x1b[32m%s\x1b[0m',);
    });
};