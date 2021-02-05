const fs = require("fs")
const ts = require("typescript")
const Clone_Json = require("./Clone_Json")
const { Transpile_Module } = require("./Transpile_Module")
const SyntaxKind = ts.SyntaxKind
// const { Find_One, Find_Mult } = require("./Selectors_List")
const path = require("path")
const { Import_File, Find_One, Find_Mult, PROPERTY_Access_Expression } = require("./SourceFile_Helper")

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

    return CHILD_DATA.Inside_Map == true ? Clone_Json.CREATE_Call_FUNCTION('KD_G', [
        // Clone_Json.CREATE_Arrow_Function(ret, ["din"])
        Clone_Json.CREATE_Arrow_Function(ret, [DATA.REGISTER_PROP_NAME])
        // ,
        // Clone_Json.CREATE_Object(Inside_Map),
        // Clone_Json.CREATE_This()
    ]) : ret
}


function FLAT_JSX_CHILDS(CHILDREN, DATA, VISITOR, CTX) {
    CHILDREN = CHILDREN.flatMap((child, index) => {

        if (SyntaxKind[child.kind] == "JsxExpression" && !child.expression) {
            // console.log(child)
            return []
        }
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

function CREATE_JSX_TAG(NODE, DATA, VISITOR, CTX, tagName, attributes, children) {
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
}





var MODIFERS = {
    JsxElement: function (NODE, DATA, VISITOR, CTX) {
        const {
            openingElement: {
                tagName,
                attributes
            },
            children
        } = NODE;

        // return  
        return CREATE_JSX_TAG(NODE, DATA, VISITOR, CTX, tagName, attributes, children)
    },
    JsxSelfClosingElement: function (NODE, DATA, VISITOR, CTX) {
        const {
            tagName,
            attributes
        } = NODE;

        return CREATE_JSX_TAG(NODE, DATA, VISITOR, CTX, tagName, attributes, [])
    },
    JsxFragment: function ({ children }, DATA, VISITOR, CTX) {




        return FLAT_JSX_CHILDS(children, DATA, VISITOR, CTX)
    },
    PropertyAccessExpression: PROPERTY_Access_Expression,
    ElementAccessExpression: PROPERTY_Access_Expression,
    ArrowFunction: function (NODE, DATA, VISITOR, CTX) {


        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        // return VISITOR(NODE, { ...DATA, Inside_Map: { ON: false, IN: true } }, VISITOR, CTX)
        // return ts.visitEachChild(NODE, Create_CTX_VISITOR(, CTX), CTX)
        // return ts.visitEachChild(NODE, VISITOR.bind({ ...DATA, Inside_Map: false }), CTX)
    },
    FunctionExpression: function (NODE, DATA, VISITOR, CTX) {


        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        // return VISITOR(NODE, { ...DATA, Inside_Map: { ON: false, IN: true } }, VISITOR, CTX)
        // return ts.visitEachChild(NODE, Create_CTX_VISITOR(, CTX), CTX)
        // return ts.visitEachChild(NODE, VISITOR.bind({ ...DATA, Inside_Map: false }), CTX)
    },
    ClassExpression: function (NODE, DATA, VISITOR, CTX) {
        // Create_CTX_VISITOR({ ...DATA, Inside_Map: false },CTX)
        // return Create_CTX_VISITOR({ ...DATA, Inside_Map: false }, CTX)(NODE)
        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        // return VISITOR(NODE, { ...DATA, Inside_Map: { ON: false, IN: true } }, VISITOR, CTX)
        // return ts.visitEachChild(NODE, Create_CTX_VISITOR({ ...DATA, Inside_Map: { ON: false, IN: true } }, CTX), CTX)
        // return ts.visitEachChild(NODE, VISITOR.bind({ ...DATA, Inside_Map: false }), CTX)
    },
    ImportDeclaration: function (NODE, DATA, VISITOR, CTX) {
        const { moduleSpecifier: { text } } = NODE;

        // return undefined
        var import_DATA = Import_File(text, DATA)


        var Imported_Names = []
        function Create_Imports(Name, ASNAME, VALUE) {
            Imported_Names.push(Clone_Json.CREATE_Declaration(ASNAME || Name, VALUE ? import_DATA.Import_Name : Clone_Json.CREATE_Access_Property(import_DATA.Import_Name, Name)))
        }


        Find_Mult(NODE.importClause, "name").forEach(function (ParentName) {
            const { name } = ParentName;
            if (name) {
                Create_Imports(
                    SyntaxKind[ParentName.kind] == "ImportClause" ? "default" : (ParentName.propertyName || name).escapedText,
                    name.escapedText,
                    SyntaxKind[ParentName.kind] == "NamespaceImport")
            }
        })

        return Imported_Names.length ? Clone_Json.CREATE_Variable(Imported_Names) : undefined
    },
    ExportKeyword: function (NODE, DATA, VISITOR, CTX) {
        return undefined
    },
    DefaultKeyword: function (NODE, DATA, VISITOR, CTX) {
        return undefined
    },
    FirstStatement: function (NODE, DATA, VISITOR, CTX) {
        var new_Statement = []
        if (NODE.modifiers) {

            NODE.modifiers.forEach(function (modifier) {
                if (SyntaxKind[modifier.kind] == "ExportKeyword") {

                    NODE.declarationList.declarations.forEach(function ({ name }) {
                        if (name.escapedText) {
                            new_Statement.push(Clone_Json.CREATE_Access_Object_Property("exports", name.escapedText, name))
                        } else {
                            Find_Mult(name, 'name').forEach(function ({ name }) {
                                if (name.escapedText) {
                                    new_Statement.push(Clone_Json.CREATE_Access_Object_Property("exports", name.escapedText, name))
                                }
                            })
                        }

                        // 
                    })
                }
                return modifier
            })
        }
        // return undefined


        return [ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)].concat(new_Statement)
        // return [ts.visitEachChild(NODE, VISITOR, CTX)].concat(new_Statement)
    },
    FunctionDeclaration: function (NODE, DATA, VISITOR, CTX) {
        if (NODE.modifiers) {
            var modifiers = Object.values(NODE.modifiers).reverse()
            for (var obj of modifiers) {
                if (typeof obj == "object") {
                    if (SyntaxKind[obj.kind] == "DefaultKeyword" || ((SyntaxKind[obj.kind] == "ExportKeyword" && ((NODE.name || {}).escapedText || {}).length))) {
                        NODE.kind = SyntaxKind["FunctionExpression"];
                        return Clone_Json.CREATE_Access_Object_Property("exports", SyntaxKind[obj.kind] == "ExportKeyword" ? NODE.name : "default", ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX))
                    }
                }
            }
        }

        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
        // return VISITOR(NODE, DATA, VISITOR, CTX)
        // return ts.visitEachChild(NODE, VISITOR, CTX)
    },
    ClassDeclaration: function (NODE, DATA, VISITOR, CTX) {
        if (NODE.modifiers) {
            var modifiers = Object.values(NODE.modifiers).reverse()
            for (var obj of modifiers) {
                if (typeof obj == "object") {
                    if (SyntaxKind[obj.kind] == "DefaultKeyword" || ((SyntaxKind[obj.kind] == "ExportKeyword" && ((NODE.name || {}).escapedText || {}).length))) {
                        NODE.kind = SyntaxKind["ClassExpression"];
                        return Clone_Json.CREATE_Access_Object_Property("exports", SyntaxKind[obj.kind] == "ExportKeyword" ? NODE.name : "default", ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX))
                    }
                }
            }
        }

        return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
        // return VISITOR(NODE, DATA, VISITOR, CTX)
        // return ts.visitEachChild(NODE, VISITOR, CTX)
    },
    ExportDeclaration: function (NODE, DATA, VISITOR, CTX) {
        // console.log(NODE)
        // console.log(SyntaxKind[NODE.exportClause.kind])
        var import_DATA,
            new_Statement = [];
        if (NODE.moduleSpecifier) {
            import_DATA = Import_File(NODE.moduleSpecifier.text, DATA)
        }

        if (!NODE.exportClause && import_DATA) {
            new_Statement.push(Clone_Json.CREATE_Call_Property(
                "Object",
                "assign",
                [Clone_Json.CREATE_Identifier("exports"), import_DATA.Import_Name]
            ))
        } else {
            Find_Mult(NODE.exportClause, "name").forEach(function (expo) {

                let name = (expo.propertyName || expo.name)
                new_Statement.push(Clone_Json.CREATE_Access_Object_Property("exports",
                    expo.name,
                    import_DATA ? (SyntaxKind[expo.kind] == "NamespaceExport" ? import_DATA.Import_Name : Clone_Json.CREATE_Object_Property(
                        import_DATA.Import_Name,
                        name
                    )) : name
                ))
            })
        }

        return new_Statement
    },
    ExportAssignment: function (NODE, DATA, VISITOR, CTX) {
        const { expression } = NODE;




        return ts.visitEachChild(Clone_Json.CREATE_Access_Object_Property("exports", "default", expression), (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
        // return VISITOR(Clone_Json.CREATE_Access_Object_Property("exports", "default", expression), DATA, VISITOR, CTX)
        //     // return ts.visitEachChild(, VISITOR, CTX)

    },
    SourceFile: function (NODE, DATA, VISITOR, CTX) {


        function Generate_statements(PATH, STATEMENTS = [], keys = {}) {

            if (!keys[PATH]) {
                var PATH_DATA = DATA.Files[PATH].DATA,
                    statements = DATA.Files[PATH].statements;

                if (!PATH_DATA.VISITED) {
                    // var vist = Create_CTX_VISITOR(PATH_DATA, CTX)
                    // var vist = Create_CTX_VISITOR(PATH_DATA, CTX)
                    // VISITOR(PATH_DATA,)
                    statements = statements.flatMap(node => VISITOR(node, PATH_DATA, VISITOR, CTX) || []);

                    DATA.Files[PATH].statements = statements;
                    PATH_DATA.VISITED = true;
                }


                // SOCKET ERRORS
                Array.prototype.push.apply(DATA.SOCKET_ERRORS, PATH_DATA.ERRORS)
                ////////////////


                keys[PATH] = true;
                for (var newPATH in DATA.Files[PATH].FILES_PATH) {
                    Generate_statements(newPATH, STATEMENTS, keys)
                }
                STATEMENTS.push(Clone_Json.CREATE_File_Imported(PATH_DATA, statements))
            }



            return STATEMENTS;
        }

        Clone_Json.CREATE_Auto_Call_Function()
        NODE.statements = [Clone_Json.CREATE_Auto_Call_Function([Clone_Json.CREATE_ARRAY()], Generate_statements(DATA.Location), ["imports"])];




        return NODE
    }
}


// console.log(ts.getDefaultCompilerOptions())
// function Create_CTX_VISITOR(DATA, CTX) {

//     VISITOR = function (NODE) {
//         var DATA = this;

//         // console.log(DATA.Location)
//         if (DATA.externalSource) {
//             NODE = ts.setSourceMapRange(ts.getMutableClone(NODE), {
//                 source: DATA.externalSource,
//                 pos: NODE.pos,
//                 end: NODE.end
//             })
//         }
//         var new_NODE = MODIFERS[SyntaxKind[NODE.kind]] ? MODIFERS[SyntaxKind[NODE.kind]](NODE, DATA, VISITOR, CTX) : ts.visitEachChild(NODE, VISITOR, CTX)

//         return new_NODE;
//     }.bind(DATA)
//     return VISITOR
// }

// function VISITOR(DATA, NODE, CTX) {

// }

module.exports = function (DATA) {
    const SourceFile = DATA.SourceFile || ts.createSourceFile("APP.js", " ", ts.ScriptTarget.Latest)

    // fs.writeFile(
    //     "response_JS_JS.js",
    //     JSON.stringify(SourceFile.statements), {
    //     encoding: "utf-8"
    // },
    //     (err) => {
    //         console.log("save SourceFile.json");
    //     }
    // );
    // console.log(path.relative(DATA.Run_Dir, DATA.Location))

    // DATA.Global_DATA.SOCKET_ERRORS = []
    Object.assign(DATA, {
        PARENT_STATEMENTS: [],
        SOCKET_ERRORS: [],
        SourceFile: Object.assign(SourceFile, {
            resolvedModules: undefined,
            externalModuleIndicator: undefined,
            exports: undefined,
            imports: undefined,
            statements: []
        }),
    })
    return Transpile_Module(DATA, {
        compilerOptions: DATA.DEVELOPER_MOD ? {
            module: ts.ModuleKind.ESNext,
            target: "ES2020",
            sourceMap: true,
            // inlineSourceMap: true,
            // lib: ["ES2015"],


            inlineSources: true,
            removeComments: true,
            // mapRoot: 'kix/',
            // "sourceRoot": "../sources/",
        } : {
                module: ts.ModuleKind.ESNext,
                target: "ES2020",
                removeComments: true,
            },
        fileName: path.relative(DATA.Run_Dir, DATA.Location),
        // outFile: "/sadas/asd/asd.js",2
        transformers: {
            before: [
                (CTX) => {
                    return function (NODE) {
                        function VISITOR(NODE, DATA, VISITOR, CTX) {

                            // console.log(DATA)
                            if (DATA.externalSource) {
                                NODE = ts.setSourceMapRange(ts.getMutableClone(NODE), {
                                    source: DATA.externalSource,
                                    pos: NODE.pos,
                                    end: NODE.end
                                })
                            }
                            // console.log(SyntaxKind[NODE.kind])
                            var new_NODE = MODIFERS[SyntaxKind[NODE.kind]] ? MODIFERS[SyntaxKind[NODE.kind]](NODE, DATA, VISITOR, CTX) : ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)

                            return new_NODE
                        }

                        return VISITOR(NODE, DATA, VISITOR, CTX)
                        // return ts.visitEachChild(NODE, () => VISITOR_CREATOR(NODE, DATA, VISITOR_CREATOR, CTX), CTX)
                    }
                    // return Create_CTX_VISITOR(DATA, CTX)

                }
            ]
        },
        // moduleName: "myModule2.js"
    })
}