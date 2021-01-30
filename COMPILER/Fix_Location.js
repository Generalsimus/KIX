const fs = require('fs');
const path = require('path');
const resolve = require('resolve');


const EXT_LIST = ["js", "jsx", "ts", "tsx", "css", "sass"]
module.exports = function (DATA) {


    try {

        return resolve.sync(DATA.Import_Location, {
            basedir: DATA.File_Start_Dir
        })
    } catch (error) {
        var ret = DATA.File_Start_Dir + "/" + DATA.Import_Location;
        // console.log(ret)
        // console.log(resolve.sync(ret, {
        //     basedir: DATA.File_Start_Dir
        // }))
        if (path.extname(ret)) {
            return ret
        }

        for (var ext of EXT_LIST) {
            let ext_ret = path.resolve(ret + "." + ext)
            if (fs.existsSync(ext_ret)) {
                return ext_ret
            }
        }


        return path.resolve(ret + ".js");
    }
}