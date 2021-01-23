const path = require('path');
const resolve = require('resolve'); 



module.exports = function (DATA) {


    try {
        return resolve.sync(DATA.Import_Location, {
            basedir: DATA.File_Start_Dir
        })
    } catch (error) {
        var ret = DATA.File_Start_Dir + "/" + DATA.Import_Location;

        return path.resolve(path.extname(ret) ? ret : ret + ".js");
    }
}