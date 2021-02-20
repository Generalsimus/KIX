const Run_Compiler = require('./index');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const fs = require("fs");
const path = require('path')
const copyFolderSync = require('../source/copyFolderSync')
const babel = require('@babel/core');
const babel_preset_minify = require("babel-preset-minify")
const babel_preset_env = require("@babel/preset-env");
const consola = require("consola");
// const { IndexKind } = require('typescript');








module.exports = (runed_dir) => {
    var P_K_Location = runed_dir + '/package.json',
        P_K_G = fs.existsSync(P_K_Location) ? require(P_K_Location) : null,
        DATA = {
            Run_Dir: runed_dir,
            Global_DATA: {
                IMPORTS_INDEX: 0
            },
            Files: {},
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


        document.querySelectorAll('script[lang="kix"]').forEach(({
            src
        }) => {

            var URL = new dom.window.URL(src, 'http://e'),
                full_src = path.resolve(runed_dir + '/' + URL.pathname);

            if (fs.existsSync(full_src)) {
                var Compiled = Run_Compiler(DATA, full_src)


                var JS_file_location = path.resolve(copy_location + Compiled.DATA.Location.replace(runed_dir, ''));


                // console.log(babel)
                // @babel/plugin-transform-runtime
                var t = (P_K_G || {}).babel_targets,
                    BabelCode = babel.transformSync(Compiled.code, {
                        // filename: "o.js",
                        code: true,
                        presets: [
                            // [require("@babel/preset-react"), {
                            //     // "targets": t
                            // }],
                            ...(t ? [
                                [babel_preset_env, {
                                    // helpers: false,
                                    // "useBuiltIns": "entry",
                                    // "corejs": 3,
                                    // "modules": false,
                                    // "useBuiltIns": "entry",
                                    // "corejs": 3,
                                    // "useBuiltIns": "usage",
                                    // modules: false,
                                    // useESModules: true,
                                    "targets": t
                                    // "targets": ["last 1 chrome version"]
                                }]
                            ] : []),
                            // [
                            //     require("@babel/preset-env"),
                            //     {
                            //         // "useBuiltIns": "entry"
                            //     }
                            // ]
                            [babel_preset_minify, {}]
                            // [require("@babel/preset-react"),{}],
                        ],
                        // helpers: false,
                        plugins: [
                            // require("@babel/plugin-transform-regenerator")
                            // [require("@babel/plugin-transform-async-to-generator", {
                            //     // absoluteRuntime:true,
                            //     // modules: "amd",
                            //     // "regenerator": true,
                            //     // "corejs": 3 // or 2; if polyfills needed
                            //     // @babel/plugin-proposal-async-generator-functions
                            // })],

                            // [require("@babel/runtime"), {
                            //     "helpers": false,
                            //     "polyfill": false,
                            //     "regenerator": true,
                            //     "moduleName": "babel-runtime"
                            // }]
                        ],
                        // optional: ["runtime"],

                        babelrc: false,
                        configFile: false,
                        sourceType: 'script'
                    });
                // console.log(BabelCode)
                // console.log(BabelCode.options)
                copy_files[JS_file_location] = BabelCode.code



            }
        })

        // CREATE index.html FILE 
        var new_inde_HTML_LOCATION = path.resolve(copy_location + "/index.html"),
            KID_ENGINE_LOCATION = ((url) => {
                do {
                    url = path.dirname(Object.keys(copy_files)[0]) + "/" + (Math.round(Math.random() * 100000000000 + 10000000000)) + "_kid.js"
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


        copyFolderSync(runed_dir, copy_location, [
            runed_dir + '/node_modules',
            runed_dir + '/build',
            runed_dir + '/package-lock.json',
            runed_dir + '/package.json',
            new_inde_HTML_LOCATION,
            copy_location

        ].map(v => path.resolve(v)).concat(Object.keys(DATA.Files)),
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