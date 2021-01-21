const express = require('express');
const app = express();
const WebSocket = require("ws").Server;
const http = require("http")
const server = http.createServer(app);
const open = require("open");
const Read_Index_Page = require("./Read_Index_Page")

var WS = new WebSocket({ server, path: "/KD/K_KD_Socket_KD_K" });


module.exports = function (runed_dir) {


    Object.assign(global, {
        WS_Sock: WS,
        KD_RESTART_PAGE: function () {
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
        res.header("content-type", "charset=utf-8");

        var V_Dir = watch_directory[req._parsedUrl.pathname];
        if (V_Dir) {
            res.end(V_Dir(res))
        } else {
            next();
        }

    });

    app.use("/", express.static(runed_dir));

    app.use(function (req, res) {
        res.end(watch_directory["/"]())
    });

    const listener = server.listen(process.env.PORT || 0, () => {
        var url = `localhost:${listener.address().port}`,
            http_url = `http://${url}`;
        Read_Index_Page(runed_dir, url)
        open(http_url);
        // console.log(http_url)
        console.save(`\nYou can now view in the browser: `, "white", http_url, 'blue', `\nTo create a production build, use: `, "white", 'npm build', 'blue')

        // console.log('\x1b[32m%s\x1b[0m',);
    });
};