const ts = require("typescript")
const path = require("path")
const Clone_Json = require("./Clone_Json")
const { CREATE_JSX_TAG, PROPERTY_Access_Expression, FLAT_JSX_CHILDS } = require("../Helpers/Transpiler_Functions")
const {
    JsxElement,
    JsxSelfClosingElement,
    JsxFragment,
    PropertyAccessExpression,
    ElementAccessExpression,
    ArrowFunction,
    FunctionExpression,
    ClassExpression,
    ImportDeclaration,
    SourceFile
} = ts.SyntaxKind






module.exports = {

    TRANSPILER_BEFORE: {
        [JsxElement]: function (NODE, DATA, VISITOR, CTX) {
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
        [JsxSelfClosingElement]: function (NODE, DATA, VISITOR, CTX) {
            const {
                tagName,
                attributes
            } = NODE;

            return CREATE_JSX_TAG(NODE, DATA, VISITOR, CTX, tagName, attributes, [])
        },
        [JsxFragment]: function ({ children }, DATA, VISITOR, CTX) {

            return FLAT_JSX_CHILDS(children, DATA, VISITOR, CTX)
        },
        [PropertyAccessExpression]: PROPERTY_Access_Expression,
        [ElementAccessExpression]: PROPERTY_Access_Expression,
        [ArrowFunction]: function (NODE, DATA, VISITOR, CTX) {


            return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        },
        [FunctionExpression]: function (NODE, DATA, VISITOR, CTX) {


            return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        },
        [ClassExpression]: function (NODE, DATA, VISITOR, CTX) {
            // Create_CTX_VISITOR({ ...DATA, Inside_Map: false },CTX)
            // return Create_CTX_VISITOR({ ...DATA, Inside_Map: false }, CTX)(NODE)
            return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, { ...DATA, Inside_Map: false }, VISITOR, CTX), CTX)
        },
        [SourceFile]: function (NODE, DATA, VISITOR, CTX) {
            // console.log(`,NODE.VISITED`, NODE.VISITED)
            // if (path.extname(NODE.originalFileName) == ".css") {

            // console.log(NODE)
            // }
            // console.log(NODE.STATE_CODE)
            if(NODE.STATE_CODE){
                // console.log(path.relative(NODE.originalFileName,DATA.Run_Dir))
            //    console.log(NODE.STATE_CODE)
                if(NODE.STATE_CODE.MAP){
                    return ts.updateSourceFileNode(NODE, [
                        Clone_Json.CREATE_Variable([Clone_Json.CREATE_Declaration('style',
                            Clone_Json.CREATE_Call_FUNCTION("KD_", [
                                Clone_Json.CREATE_Call_FUNCTION("KD_", [
                                    Clone_Json.CREATE_Access_Property(Clone_Json.CREATE_Identifier('document'), 'head'),
                                    Clone_Json.CREATE_Object([
                                        Clone_Json.CREATE_Property('style', Clone_Json.CREATE_TEXT(''))
                                    ])
                                    // Clone_Json.CREATE_TEXT(result.css.toString())
                                ]),
                                Clone_Json.CREATE_TEXT(NODE.STATE_CODE.RES_CSS)
                                // Clone_Json.CREATE_TEXT(result.css.toString())
                            ])
                        )]),
                        Clone_Json.CREATE_Call_FUNCTION("KD_", [ 
                            Clone_Json.CREATE_Call_FUNCTION(Clone_Json.CREATE_Access_Property(Clone_Json.CREATE_Identifier('style'), 'Parent'), []),
                            Clone_Json.CREATE_TEXT(NODE.STATE_CODE.MAP)
                            // Clone_Json.CREATE_Identifier(style)
                        ]),
                        Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_Identifier('style'))
                        // Clone_Json.CREATE_Export('default', Clone_Json.CREATE_Identifier('style'))
                    ])

                }else{
                   return ts.updateSourceFileNode(NODE, [
                        Clone_Json.CREATE_Access_Object_Property("exports", 'default', Clone_Json.CREATE_Call_FUNCTION("KD_", [
                            
                            Clone_Json.CREATE_Access_Property(Clone_Json.CREATE_Identifier("KD_"), 'style'),
                            
                            Clone_Json.CREATE_TEXT(NODE.STATE_CODE.RES_CSS)]))
                    ])
                    // NODE.statements = 
                }
                // NODE.statements = []
                // // NODE.scriptKind = ts.ScriptKind.JSON
            }


            // if (NODE.VISITED) {
            //     return NODE
            // } else {
            return ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
            // }
        }
    },
    TRANSPILER_AFTER: {
        [SourceFile]: function (NODE, DATA, VISITOR, CTX) {
            // return NODE
            // console.log(`NODE.originalFileName`, NODE.originalFileName)

            

            NODE.VISITED = true
            let statements = [Clone_Json.CREATE_File_Imported(
                DATA.Files_THRE[NODE.originalFileName].IMPORTS_INDEX,
                NODE.statements.flatMap((statements_NODE) => {
                    // contacts.has('Jessie')
                    if (statements_NODE.pos < 0 && ts.SyntaxKind[statements_NODE.kind] == "ExpressionStatement") {
                        // NODE.expression.arguments[2].parameters.push(NODE.expression.arguments[2].parameters[2])
                        // console.log(NODE.expression.arguments[2].parameters[2])


                        const { expression: { arguments } } = statements_NODE;


                        try {


                            var Imported_Names = arguments[2].parameters.slice(2).map((node, node_index) => {

                                // console.log(node, NODE.imports[node_index].text)
                                // console.log(NODE.locals.get(node.name.escapedText)?.declarations[0].parent.parent.moduleSpecifier.text)
                                // console.log(node.name.escapedText)
                                try {
                                    var { name: { original: { moduleSpecifier: { text } } } } = node;
                                } catch (e) {
                                    var text = NODE.locals.get(node.name.escapedText).declarations[0].parent.parent.moduleSpecifier.text;
                                }


                                // console.log(text,NODE.resolvedModules.get(text)?.resolvedFileName)
                                if (!NODE.resolvedModules.get(text)?.resolvedFileName && path.extname(NODE.originalFileName).toLocaleLowerCase() == ".js") {

                                    // console.log(node);
                                    NODE.parseDiagnostics.push({
                                        file: NODE,
                                        messageText: `Cannot find module '${text} '.`,
                                        start: NODE.imports.find(node => node.text == text).pos
                                    })
                                }





                                return Clone_Json.CREATE_Declaration(node, Clone_Json.CREATE_Access_ElementAccess(
                                    Clone_Json.CREATE_Identifier("imports"),
                                    // 0
                                    DATA.Files_THRE[NODE.resolvedModules.get(text).resolvedFileName].IMPORTS_INDEX
                                ))
                            })

                            statements_NODE.expression.arguments[2].body.statements.splice(0, 0, ...(Imported_Names.length ? [Clone_Json.CREATE_Variable(Imported_Names)] : []))
                            return statements_NODE.expression.arguments[2].body.statements
                        } catch (error) {
                            // console.log(NODE)
                            // console.log(error)
                            return [Clone_Json.CREATE_Access_Object_Property("exports", 'default', arguments[2])]
                        }



                    }
                    return [statements_NODE]

                }).flatMap((NODE) => {
                    if (NODE.pos < 0) {

                        // return []
                        if (ts.SyntaxKind[NODE.kind] == "ExpressionStatement" &&
                            NODE.expression &&
                            ((NODE.expression.arguments &&
                                NODE.expression.arguments[0] &&
                                NODE.expression.arguments[0].escapedText == 'exports' &&
                                NODE.expression.arguments[1] &&
                                NODE.expression.arguments[1].text == '__esModule' &&
                                ts.SyntaxKind[NODE.expression.arguments[2].kind] == "ObjectLiteralExpression") ||
                                (ts.SyntaxKind[NODE.expression.kind] == "StringLiteral" &&
                                    NODE.expression.text == 'use strict'))) {

                            return []
                        }
                        // console.log(ts.SyntaxKind[NODE.expression.kind], NODE.expression)
                    }
                    // return [NODE]
                    return [NODE]
                })
            )]
            // ts.updateSourceFileNode(NODE, [Clone_Json.CREATE_File_Imported(DATA.Files_THRE[NODE.originalFileName].IMPORT_INDEX, statements)])
            // NODE.statements = [Clone_Json.CREATE_File_Imported(DATA.Files_THRE[NODE.originalFileName].IMPORT_INDEX, statements)]
            // console.log(path.resolve(NODE.originalFileName), Object.keys(DATA.Files_THRE))
            NODE.VISITED = true;

            return ts.updateSourceFileNode(NODE, statements)
            // }



        }
    }
}