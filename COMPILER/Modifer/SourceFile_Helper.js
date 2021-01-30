const path = require("path")
const Clone_Json = require("./Clone_Json")
const ts = require("typescript")
const SyntaxKind = ts.SyntaxKind



var SAVE_LOG = [],
    COLORS = {
        white: "\x1b[37m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        red: "\x1b[31m",
        blue: "\x1b[34m"
    };

console.save = function () {
    return
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
    Import_File: function (Import_Location, DATA, priority_DATA) {

        // გენერირდება DATA ფაილი იმპორტირებული ფაილისთვის  
        var import_DATA = Compiler({
            ...DATA,
            IMPORTS_INDEX: priority_DATA ? priority_DATA.IMPORTS_INDEX : ++DATA.Global_DATA.IMPORTS_INDEX,
            Import_Location: Import_Location,
            File_Start_Dir: path.dirname(DATA.Location),
            ...priority_DATA,
            WATCHED: priority_DATA ? true : false
        });
        //////////////////////////////////////////////////////  

        DATA.Files[DATA.Location].FILES_PATH[import_DATA.Location] = import_DATA;
        return import_DATA
    },
    PROPERTY_Access_Expression: function (NODE, DATA, VISITOR, CTX) {

        const check_node = (NODE) => ["ElementAccessExpression", "PropertyAccessExpression"].includes(SyntaxKind[NODE.kind])

        function register_prop(NODE, REGISTER_PROP = []) {


            if (check_node(NODE)) {


                if (!check_node(NODE.expression)) {
                    REGISTER_PROP.push(NODE.expression)
                } else if (NODE.expression) {
                    register_prop(NODE.expression, REGISTER_PROP)
                }

                if (NODE.argumentExpression) {
                    REGISTER_PROP.push(NODE.argumentExpression)
                } else if (NODE.name) {
                    // CREATE_TEXT
                    REGISTER_PROP.push(Clone_Json.CREATE_TEXT(NODE.name.escapedText))
                }


                // console.log(NODE.name)
                // REGISTER_PROP.push(NODE)
            }



            return REGISTER_PROP
        }
        // REGISTER_PROP.length ?
        // REGISTER_LIST.length?:
        if (DATA.Inside_Map == "in" || DATA.Inside_Map == true) {
            // console.log(DATA.Inside_Map)
            var REGISTER_LIST = register_prop(NODE)
            if (REGISTER_LIST.length) {
                DATA.Inside_Map = true
                // NODE = Clone_Json.CREATE_Call_FUNCTION('reg', register_prop(NODE))
                NODE = Clone_Json.CREATE_Call_FUNCTION(DATA.REGISTER_PROP_NAME, register_prop(NODE))
            }
        }


        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
        // return VISITOR(NODE, DATA, VISITOR, CTX)
        // return ts.visitEachChild(NODE, VISITOR, CTX)
        // return ts.visitEachChild(), Create_CTX_VISITOR(DATA, CTX), CTX)
        // return Create_CTX_VISITOR({ ...DATA, Inside_Map: false }, CTX)(NODE)
    }
}