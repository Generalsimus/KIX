// const Run_Compiler = require('./index');/
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const fs = require("fs");
const path = require('path')
const copyFolderSync = require('../source/copyFolderSync')
const babel = require('@babel/core');
const babel_preset_minify = require("babel-preset-minify")
// const babel_preset_env = require("@babel/preset-env");
const consola = require("consola");
// const { IndexKind } = require('typescript');

const CREATE_PROGRAM = require("./CREATE_PROGRAM")

const remapping = require("@ampproject/remapping")







module.exports = (runed_dir) => {
    var P_K_Location = runed_dir + '/package.json',
        P_K_G = fs.existsSync(P_K_Location) ? require(P_K_Location) : null,
        // DATA = {
        //     Run_Dir: runed_dir,
        //     Global_DATA: {
        //         IMPORTS_INDEX: 0
        //     },
        //     Files: {},
        //     DEVELOPER_MOD: false,
        // },
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
            Files: [],
            DEVELOPER_MOD: false,
        },
        copy_files = {};

    var index_location = runed_dir + '/index.html'
    
    if (fs.existsSync(index_location)) {
        const dom = new JSDOM(fs.readFileSync(index_location, "utf8"));
        var document = dom.window.document,
            dist_dir = runed_dir + '/build',
            copy_location = path.resolve((COMMANDS.BUILD_DIR ? COMMANDS.BUILD_DIR + "/" + path.basename(runed_dir) : false) || (path.resolve(runed_dir + '/build' + (() => {
                var i = 0,
                    base = path.basename(runed_dir);
                while (fs.existsSync(dist_dir + "/" + base + (i || ''))) {
                    i++
                }
                try {
                    fs.mkdirSync(dist_dir);
                } catch (e) { }

                return "/" + base + (i || '')
            })())));


        if (fs.existsSync(copy_location)) {
            fs.rmSync(copy_location, {
                recursive: true
            }, () => { });
        }
        // return


        document.querySelectorAll('script[lang="kix"]').forEach((ELEMENT) => {

            var URL = new dom.window.URL(ELEMENT.src, 'http://e'),
                full_src = path.resolve(runed_dir + '/' + decodeURIComponent(URL.pathname));

            if (fs.existsSync(full_src)) {


                var JS_file_location = path.resolve(copy_location + full_src.replace(runed_dir, ''));


                // console.log(babel)
                // @babel/plugin-transform-runtime
                var PROGRAM = CREATE_PROGRAM(full_src, {
                    ...DATA,
                    RESET_REQUEST_FILE: function () {
                        let thisob = DATA.PROGRAMS[full_src]
                        thisob.RESULT = thisob.PROGRAM.Emit()
                        KD_RESTART_PAGE()
                    }
                })


                DATA.Files = DATA.Files.concat(PROGRAM.getServices().getProgram().getSourceFiles().map(v => v.originalFileName))
                PROGRAM.Emit()

                // console.log(PROGRAM.getCode())
                // const TRANSFORMED_MAP = JSON.parse(PROGRAM.getMap()) 

                const BABEL_CODE = babel.transformSync(PROGRAM.getCode(), {
                    // filename: TRANSFORMED_MAP.file + ".js",
                    code: true,
                    presets: [[babel_preset_minify, {}]],
                    babelrc: false,
                    configFile: false,
                    sourceType: 'script',
                    sourceMap: true
                });



                let new_Location = JS_file_location + ([".ts", ".tsx"].includes(path.extname(JS_file_location)) ? ".js" : "")

                ELEMENT.src = "/" + path.relative(copy_location, new_Location).replace(/\\/g, "/");;
                copy_files[JS_file_location] = {
                    TO: new_Location,
                    CODE: BABEL_CODE.code
                };


            }
        })

        // CREATE index.html FILE 
        var new_inde_HTML_LOCATION = path.resolve(copy_location + "/index.html"),
            KID_ENGINE_LOCATION = ((url) => {
                do {
                    url = copy_location + "/" + (Math.round(Math.random() * 100000000000 + 10000000000)) + "_kid.js"
                } while (fs.existsSync(url))

                return url
            })()

        // copy_files[KID_ENGINE_LOCATION] = fs.readFileSync(__dirname + "/../source/JSkid/kid_script.min.js", "utf8")

        // consola.log(copy_files)
        document.head[document.head.firstElementChild ? "insertBefore" : "appendChild"](
            Object.assign(document.createElement('script'), {
                src: ("/" + path.relative(copy_location, KID_ENGINE_LOCATION)).replace(/\\/g, "/")
            }),
            document.head.firstElementChild
        );
        copy_files[new_inde_HTML_LOCATION] = "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
        //////////////////////////

        // consola.log(Object.keys(DATA.Files))

        copyFolderSync(runed_dir, copy_location, [
            runed_dir + '/node_modules',
            runed_dir + '/build',
            runed_dir + '/package-lock.json',
            runed_dir + '/package.json',
            new_inde_HTML_LOCATION,
            copy_location,
            ...DATA.Files
        ].map(v => path.resolve(v)),
            copy_files);

        // აკოპირებს ქიქსის
        fs.copyFileSync(__dirname + "/../source/JSkid/kid_script.min.js", KID_ENGINE_LOCATION)
        //////////////////
        consola.info("Location: " + copy_location)
        // document.head[document.head.firstElementChild ? "insertBefore" : "appendChild"](
        //     Object.assign(document.createElement('script'),
        //         { src: `https://unpkg.com/kid-js-lib@1.2.5/kid_script.js` }),
        //     document.head.firstElementChild
        // )

        // dom.window.document
        // copy_location

    } else {
        consola.error(`NOT EXIST index.html in ${runed_dir}`)
    }

}