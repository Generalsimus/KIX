const Run_Compiler = require('./index');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require('path')
const copyFolderSync = require('../source/copyFolderSync')

module.exports = (runed_dir) => {
    var no_copy = [
        runed_dir + '/node_modules',
        runed_dir + '/dist',
        runed_dir + '/package-lock.json',
        runed_dir + '/package.json'
    ]

    var index_location = runed_dir + '/index.html'
    if (fs.existsSync(index_location)) {
        const dom = new JSDOM(fs.readFileSync(index_location, "utf8"));
        var document = dom.window.document;
        document.querySelectorAll("script[KD_script]").forEach(({ src }) => {
            console.log(src)
            var URL = new dom.window.URL(src, 'http://e'),
                full_src = path.resolve(runed_dir + '/' + URL.pathname);

            if (fs.existsSync(full_src)) {
                var Compiled = Run_Compiler({
                    Import_Location: URL.pathname,
                    Run_Dir: runed_dir,
                    Compiler_mod: 'dist',
                })
                no_copy.push(...Object.keys(Compiled.DATA.IMPORTS))


                console.log(path.basename(runed_dir))
                var dist_dir = runed_dir + '/dist'

                copyFolderSync(runed_dir, path.resolve(runed_dir + '/dist' + (() => {
                    var i = 0,
                        base = path.basename(runed_dir);
                    while (fs.existsSync(dist_dir + "/" + base + (i || ''))) {
                        i++
                    }
                    try {
                        fs.mkdirSync(dist_dir);
                    } catch (e) { }

                    return "/" + base + (i || '')
                })()), no_copy.map(v => path.resolve(v)))
                console.log('11111111111111', Object.keys(Compiled.DATA.IMPORTS), '11111111111111')
            }
        })
    } else {
        console.error(new Error(`NOT EXIST index.html in ${runed_dir}`))
    }

}