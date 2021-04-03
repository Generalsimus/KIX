const Clone_Json = require("../Modifer/Clone_Json")
const ts = require("typescript")
const SyntaxKind = ts.SyntaxKind

function FLAT_JSX_CHILDS(CHILDREN, DATA, VISITOR, CTX) {
    CHILDREN = CHILDREN.flatMap((child, index) => {


        if (
            (index === 0 && child.text && child.text.trim().length === 0) ||
            (index === CHILDREN.length - 1 && child.text && child.text.trim().length === 0) ||
            (SyntaxKind[child.kind] == "JsxExpression" && !child.expression)
        ) {
            // console.log(child)
            return []
        } 
        // else if (child.text && child.text.trim().length === 0) {
        //     child.text = " "
        // }

        // if  {
        //     // console.log(child)
        //     return []
        // }
        // // აკეთებს ტრიმს ტეგში მყოფი პირველი და ბოლო ტეგისთვის 
        // if (v.text && [0, children.length - 1].includes(index)) {
        //     var v_text = v.text[children.length == 1 ? "trim" : (index ? "trimRight" : "trimLeft")]()
        //     if (!v_text.length) {
        //         return []
        //     }
        //     v.text = v_text;
        // }
        // /////////////////////////////////////////////////////////
        return JSX_CHILDREN_REGISTRATOR(child.expression || child, undefined, DATA, VISITOR, CTX)
        // return PROPERTY(child.expression || child);
    })
    return CHILDREN.length > 1 ? Clone_Json.CREATE_ARRAY(CHILDREN) : CHILDREN[0] || Clone_Json.CREATE_TEXT('')

}
function JSX_CHILDREN_REGISTRATOR(expression, attributes, DATA, VISITOR, CTX) {

    if (expression.text && [SyntaxKind["StringLiteral"], SyntaxKind["JsxText"]].includes(expression.kind)) {
        return Clone_Json.CREATE_TEXT(expression.text)
    }


    var CHILD_DATA = {
        ...DATA, Inside_Map: "in"
    }
    // var ret = Create_CTX_VISITOR(CHILD_DATA, CTX)(expression)
    var ret = VISITOR(expression, CHILD_DATA, VISITOR, CTX)
    // var ret = VISITOR.bind({ ...DATA, Inside_Map: Inside_Map })(expression)


    // Inside_Map = Object.keys(Inside_Map).map(v => {
    //     return Clone_Json.CREATE_Property(v, Inside_Map[v])
    // })

    return CHILD_DATA.Inside_Map == true ? Clone_Json.CREATE_Property_Registrator(CHILD_DATA, ret) : ret
    // return CHILD_DATA.Inside_Map == true ? Clone_Json.CREATE_Call_FUNCTION('KD_G', [
    //     // Clone_Json.CREATE_Arrow_Function(ret, ["din"])
    //     Clone_Json.CREATE_Arrow_Function(ret, [CHILD_DATA.REGISTER_PROP_NAME])
    //     // ,
    //     // Clone_Json.CREATE_Object(Inside_Map),
    //     // Clone_Json.CREATE_This()
    // ]) : ret
}



module.exports = {
    CREATE_JSX_TAG: function CREATE_JSX_TAG(NODE, DATA, VISITOR, CTX, tagName, attributes, children) {
        const Events_Prop_Array = [];

        return Clone_Json.CREATE_Object([tagName, ...attributes.properties].flatMap((v, i) => {



            if (!i) {
                var CHILDREN = FLAT_JSX_CHILDS(children, DATA, VISITOR, CTX)
            }


            // გენერირდება ობიექტის ფროფერთის სახელი 
            var property_identifer = (v.name || v)
            ////////////////////////////////////////// 


            switch (SyntaxKind[property_identifer.kind]) {
                case "Identifier":
                    var prop_name = property_identifer.escapedText;

                    // var return_prop_value = 
                    var return_prop_value = i ?
                        JSX_CHILDREN_REGISTRATOR(
                            v.initializer ? (v.initializer.expression || v.initializer) : Clone_Json.CREATE_TEXT(""),
                            prop_name, DATA, VISITOR, CTX)

                        : CHILDREN


                    if (i) {
                        // console.log(prop_name, SyntaxKind[return_prop_value.kind])
                        if (/^on/.test(prop_name)) {
                            var evn = prop_name.replace(/^on/, "")
                            if (/^[A-Z]/.test(evn)) {
                                Events_Prop_Array.push(Clone_Json.CREATE_Property(evn.toLocaleLowerCase(), return_prop_value))
                                return []
                            }
                        } else if (prop_name == 'e') {
                            if (SyntaxKind[return_prop_value.kind] == "ObjectLiteralExpression") {
                                Events_Prop_Array.push(...return_prop_value.properties)
                            }
                            return []
                        }
                    }


                    return Clone_Json.CREATE_Property(property_identifer, return_prop_value, !/^[a-zA-Z0-9_$]+$/.test(prop_name))
                case "JsxSpreadAttribute":
                    property_identifer.kind = SyntaxKind["SpreadAssignment"]
                    return [property_identifer]
                default:
                    return []
            }


        }).concat(Events_Prop_Array.length ? [Clone_Json.CREATE_Property("e", Clone_Json.CREATE_Object(Events_Prop_Array))] : []))
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
                DATA.REGISTER_PROP_NAME = DATA.REGISTER_PROP_NAME || ts.createUniqueName('PROP')
                // NODE = Clone_Json.CREATE_Call_FUNCTION('reg', register_prop(NODE))
                NODE = Clone_Json.CREATE_Call_FUNCTION(DATA.REGISTER_PROP_NAME, register_prop(NODE))
            }
        }


        // return NODE
        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)

    },
    FLAT_JSX_CHILDS: FLAT_JSX_CHILDS
}