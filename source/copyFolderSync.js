var fs = require("fs");
const path = require("path");


module.exports = function copyFolderSync(from, to, noDir = [], copy_files = {}) {
    // console.log(from, to, noDir)

    if (copy_files[to]) {
        // console.log(`${to} Compiled`);
        fs.writeFileSync(copy_files[to]?.TO || to, copy_files[to]?.CODE || copy_files[to]);
    } else if (noDir.indexOf(from) < 0) {


        const stat = fs.lstatSync(from);

        // console.log(from, to, stat.isFile(), stat.isSymbolicLink(), stat.isDirectory())

        if (stat.isFile()) {
            fs.copyFileSync(from, to)
        } else if (stat.isSymbolicLink()) {
            fs.symlinkSync(
                fs.readlinkSync(from),
                to
            )
        } else if (stat.isDirectory()) {
            try {
                fs.mkdirSync(to);
            } catch (e) { }


            fs.readdirSync(from).forEach((element) => {
                copyFolderSync(path.join(from, element), path.join(to, element), noDir, copy_files);
            })
            if (!fs.readdirSync(to).length) {
                fs.rmdirSync(to, {
                    recursive: true
                })
            }
        }

    }
};