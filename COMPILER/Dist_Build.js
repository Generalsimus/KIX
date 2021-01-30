const Run_Compiler = require('./index');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require('path')
const copyFolderSync = require('../source/copyFolderSync')
const babel = require('@babel/core');
const babel_preset_minify = require("babel-preset-minify")
const babel_preset_env = require("@babel/preset-env");
// const { IndexKind } = require('typescript');








module.exports = (runed_dir) => {
    var P_K_Location = runed_dir + '/package.json',
        P_K_G = fs.existsSync(P_K_Location) ? require(P_K_Location) : null,
        DATA = {
            Run_Dir: runed_dir,
            Global_DATA: { IMPORTS_INDEX: 0 },
            Files: {},
            DEVELOPER_MOD: false,
        }, copy_files = {};

    var index_location = runed_dir + '/index.html'
    if (fs.existsSync(index_location)) {
        const dom = new JSDOM(fs.readFileSync(index_location, "utf8"));
        var document = dom.window.document,
            dist_dir = runed_dir + '/build',
            copy_location = path.resolve(runed_dir + '/build' + (() => {
                var i = 0, base = path.basename(runed_dir);
                while (fs.existsSync(dist_dir + "/" + base + (i || ''))) { i++ }
                try { fs.mkdirSync(dist_dir); } catch (e) { }

                return "/" + base + (i || '')
            })());

        document.querySelectorAll("script[kix_app]").forEach(({ src }) => {

            var URL = new dom.window.URL(src, 'http://e'),
                full_src = path.resolve(runed_dir + '/' + URL.pathname);

            if (fs.existsSync(full_src)) {
                var Compiled = Run_Compiler(DATA, full_src)


                var JS_file_location = path.resolve(copy_location + Compiled.DATA.Location.replace(runed_dir, ''));


                var t = (P_K_G || {}).babel_targets,
                    BabelCode = babel.transform(Compiled.code, {
                        filename: "o.js", code: true,
                        presets: [...(t ? [[babel_preset_env, {
                            "targets": t
                        }]] : []), babel_preset_minify],
                        babelrc: false,
                        configFile: false,
                        sourceType: 'script'
                    }).code;

                copy_files[JS_file_location] = BabelCode



            }
        })

        // CREATE index.html FILE 
        var new_inde_HTML_LOCATION = path.resolve(copy_location + "/index.html");
        document.head[document.head.firstElementChild ? "insertBefore" : "appendChild"](
            Object.assign(document.createElement('script'),
                { src: `https://unpkg.com/kid-js-lib@1.2.11/kid_script.js` }),
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

        ].map(v => path.resolve(v)).concat(Object.keys(DATA.Files)),
            copy_files);

        // document.head[document.head.firstElementChild ? "insertBefore" : "appendChild"](
        //     Object.assign(document.createElement('script'),
        //         { src: `https://unpkg.com/kid-js-lib@1.2.5/kid_script.js` }),
        //     document.head.firstElementChild
        // )

        // dom.window.document
        // copy_location

    } else {
        console.error(new Error(`NOT EXIST index.html in ${runed_dir}`))
    }

}