const path = require("path")
// const Clone_Json = require("./Clone_Json")
// const { SyntaxKind } = require("typescript")



var SAVE_LOG = [],
    COLORS = {
        white: "\x1b[37m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        red: "\x1b[31m",
        blue: "\x1b[34m"
    };

console.save = function () {
    // return
    console.clear();

    var i = 0;
    while (arguments[i]) {
        var str = arguments[i],
            color = arguments[i + 1] || 'white';

        SAVE_LOG.push(`${COLORS[color] + str}\x1b[0m`)
        i = i + 2;
    }

    console.log.apply(null, SAVE_LOG)

}



function Find_Mult(object, key, arr = []) {
    if (typeof object == 'object') {
        for (var prop in object) {
            if (!["declarations", "parent"].includes(prop)) {
                if (prop == key) {
                    arr.push(object)
                }
                Find_Mult(object[prop], key, arr)
            }
        }
    }
    return arr;
}
function Find_One(object, key) {
    if (typeof object == 'object') {
        for (var prop in object) {
            if (!["declarations", "parent"].includes(prop) && object[prop]) {
                if (prop == key) {
                    return object
                }
                var ret = Find_One(object[prop], key)
                if (ret) {
                    return ret
                }
            }
        }
    }
}

module.exports = {
    Find_Mult: Find_Mult,
    Find_One: Find_One,
    Import_File: function (import_text, DATA, IMPORTS_INDEX, priority_DATA) {
        // გენერირდება DATA ფაილი იმპორტირებული ფაილისთვის  
        var import_DATA = Compiler({
            ...DATA,
            IMPORTS_INDEX: IMPORTS_INDEX || ++DATA.Global_DATA.IMPORTS_INDEX,
            Import_Location: import_text,
            File_Start_Dir: path.dirname(DATA.Location),
            ...(priority_DATA || {})
        });
        //////////////////////////////////////////////////////  

        DATA.Files[DATA.Location].FILES_PATH[import_DATA.Location] = import_DATA;
        return import_DATA
    }
}