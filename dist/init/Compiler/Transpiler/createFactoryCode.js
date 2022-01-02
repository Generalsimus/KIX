"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFactory = void 0;
const path_1 = __importDefault(require("path"));
const typescript_1 = __importStar(require("typescript"));
const utils_1 = require("../../../helpers/utils");
const App_1 = require("../../App");
const CompileFile_1 = require("../CompileFile");
const amdBodyVisitor_1 = require("./amdBodyVisitor");
const utils_2 = require("./utils");
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createBlock, createIdentifier, createPropertyAccessExpression, createObjectLiteralExpression, createParameterDeclaration, createParenthesizedExpression, createArrowFunction, createCallExpression, createObjectBindingPattern, createBindingElement, createExpressionStatement, createElementAccessExpression, createForInStatement, createPropertyAssignment, createStringLiteral, createSpreadAssignment, createUniqueName, createReturnStatement, } = typescript_1.factory;
const { PlusToken, EqualsToken } = typescript_1.SyntaxKind;
exports.generateFactory = {
    CREATE_Plus_Token_Nodes(Nodes) {
        return this.CREATE_Token_Nodes(Nodes, PlusToken);
    },
    CREATE_Equals_Token_Nodes(Nodes) {
        return this.CREATE_Token_Nodes(Nodes, EqualsToken);
    },
    CREATE_Token_Nodes(Nodes, Token) {
        return Nodes.reduce((NodeA, NodeB) => {
            return createBinaryExpression(this.CREATE_Identifier(NodeA), createToken(Token), this.CREATE_Identifier(NodeB));
        });
    },
    CREATE_Identifier(StringOrNode) {
        return typeof StringOrNode === "string" ?
            createIdentifier(StringOrNode) :
            StringOrNode;
    },
    CREATE_Parameter_Declaration(ArgumentsNodes) {
        return ArgumentsNodes.map((argNode) => createParameterDeclaration(undefined, undefined, undefined, this.CREATE_Identifier(argNode), undefined, undefined, undefined));
    },
    CREATE_Arrow_Function_With_Parenthesized_Expression(ClildNode, ArgumentsNodes) {
        return createArrowFunction(undefined, undefined, this.CREATE_Parameter_Declaration(ArgumentsNodes), undefined, createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), typescript_1.factory.createParenthesizedExpression(ClildNode));
    },
    CREATE_Prop_Registrator_For_Attribute(newNode, getRegistratorName) {
        return this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(getRegistratorName, [
            this.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [getRegistratorName])
        ]), [
            createUniqueName("__node"),
            createUniqueName("__atrName"),
            getRegistratorName,
        ]);
    },
    CREATE_Prop_Registrator_For_Child(newNode, getRegistratorName) {
        return this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(getRegistratorName, [
            this.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [getRegistratorName])
        ]), [
            createUniqueName("__node"),
            getRegistratorName
        ]);
    },
    CREATE_Object_Binding_Pattern(namesObject, returnValue = []) {
        for (const nameKey in namesObject) {
            const value = namesObject[nameKey];
            returnValue.push(createBindingElement(undefined, value && createIdentifier(nameKey), (value && this.CREATE_Object_Binding_Pattern(value)) ||
                createIdentifier(nameKey), undefined));
        }
        return createObjectBindingPattern(returnValue);
    },
    CREATE_CAll_Function(CallNameOrNode, Arguments) {
        return createCallExpression(this.CREATE_Identifier(CallNameOrNode), undefined, Arguments.map((arg) => this.CREATE_Identifier(arg)));
    },
    CREATE_Const_Variable(Nodes, flag = typescript_1.default.NodeFlags.Const) {
        return createVariableStatement(undefined, createVariableDeclarationList(Nodes.map(([NameNode, ValueNode]) => {
            return createVariableDeclaration(NameNode, undefined, undefined, ValueNode);
        }), flag));
    },
    CREATE_Object_WiTH_String_Keys(Nodes) {
        return createObjectLiteralExpression(Nodes.map((ArgNodesOrNode) => ArgNodesOrNode instanceof Array ?
            createPropertyAssignment.apply(null, ArgNodesOrNode) :
            ArgNodesOrNode, false));
    },
    CREATE_Spread_Assignment(Node) {
        return createSpreadAssignment(createParenthesizedExpression(Node));
    },
    CREATE_Assign_Polyfil(AppNameNode, Nodes) {
        return this.CREATE_Const_Variable([
            [
                AppNameNode,
                createArrowFunction(undefined, undefined, this.CREATE_Parameter_Declaration(["n", "s"]), undefined, createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), createBlock([
                    createForInStatement(createVariableDeclarationList([
                        createVariableDeclaration(createIdentifier("o"), undefined, undefined, undefined),
                    ], typescript_1.default.NodeFlags.Const), createIdentifier("s"), createBlock([
                        createExpressionStatement(this.CREATE_Token_Nodes([
                            this.CREATE_Element_Access_Expression(["n", "o"]),
                            this.CREATE_Element_Access_Expression(["s", "o"])
                        ], typescript_1.default.SyntaxKind.EqualsToken))
                    ], false)),
                ], false)),
            ],
        ]);
    },
    CREATE_Property_Access_Expression(propertys) {
        return propertys.reduce((propName1, propName2) => {
            return createPropertyAccessExpression(this.CREATE_Identifier(propName1), this.CREATE_Identifier(propName2));
        });
    },
    CREATE_Element_Access_Expression(propertys) {
        return propertys.reduce((propName1, propName2) => {
            return createElementAccessExpression(this.CREATE_Identifier(propName1), this.CREATE_Identifier(propName2));
        });
    },
    CREATE_Property_Access_Equals_Token(Node, decoratorPropertys = []) {
        return this.CREATE_Equals_Token_Nodes([
            this.CREATE_Property_Access_Expression(decoratorPropertys),
            Node,
        ]);
    },
    CREATE_Export_File_Function(body, __Import_Module_Name, moduleIndex) {
        return this.CREATE_CAll_Function(__Import_Module_Name + "_Module", [
            typescript_1.factory.createNumericLiteral(moduleIndex),
            typescript_1.factory.createArrowFunction(undefined, undefined, this.CREATE_Parameter_Declaration(["exports"]), undefined, typescript_1.factory.createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), typescript_1.factory.createBlock(body, true))
        ]);
    },
    CREATE_Bind_Function(Name, ClildNode, ArgumentsNodes) {
        return typescript_1.factory.createFunctionDeclaration(undefined, undefined, undefined, typescript_1.factory.createIdentifier(Name), undefined, this.CREATE_Parameter_Declaration(ArgumentsNodes), undefined, typescript_1.factory.createBlock(ClildNode, true));
    },
    CREATE_Module_GET_POLYFIL(__Import_Module_Name) {
        return this.CREATE_Const_Variable([
            [
                __Import_Module_Name + "_Module",
                this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(this.CREATE_Property_Access_Expression(["Object", "defineProperty"]), [
                    __Import_Module_Name,
                    "accessKey",
                    this.CREATE_Object_WiTH_String_Keys([
                        [
                            "get",
                            this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_Token_Nodes([
                                typescript_1.factory.createIdentifier("exported"),
                                this.CREATE_Token_Nodes([
                                    this.CREATE_CAll_Function("moduleBlockFunction", [
                                        this.CREATE_Token_Nodes([
                                            typescript_1.factory.createIdentifier("exported"),
                                            this.CREATE_Object_WiTH_String_Keys([])
                                        ], typescript_1.default.SyntaxKind.EqualsToken)
                                    ]),
                                    typescript_1.factory.createIdentifier("exported")
                                ], typescript_1.default.SyntaxKind.CommaToken)
                            ], typescript_1.default.SyntaxKind.BarBarToken), [])
                        ]
                    ])
                ]), [
                    "accessKey",
                    "moduleBlockFunction",
                    "exported",
                ]),
            ]
        ]);
    },
    CREATE_SourceFile_Polyfill_IF_NEEDED(sourceFile, CTX, compilerOptions) {
        if (!CTX.Module_GET_POLYFIL) {
            sourceFile.statements.splice(0, 0, (CTX.Module_GET_POLYFIL =
                (sourceFile.Module_GET_POLYFIL =
                    exports.generateFactory.CREATE_Module_GET_POLYFIL(compilerOptions.__Import_Module_Name))));
        }
    },
    CREATE_JSON_SourceFile(sourceFile, moduleInfo, compilerOptions) {
        sourceFile = typescript_1.default.updateSourceFileNode(sourceFile, [
            typescript_1.factory.createExpressionStatement(this.CREATE_Export_File_Function(sourceFile.statements.map((node) => {
                return typescript_1.factory.createExpressionStatement(this.CREATE_Equals_Token_Nodes([
                    this.CREATE_Property_Access_Expression(["exports", "default"]),
                    node.expression
                ]));
            }), compilerOptions.__Import_Module_Name, moduleInfo.moduleIndex))
        ]);
        sourceFile.scriptKind = typescript_1.default.ScriptKind.Unknown;
        return sourceFile;
    },
    CREATE_IMPORT_JS_SourceFile(sourceFile, CTX, moduleInfo, compilerOptions) {
        sourceFile = typescript_1.default.updateSourceFileNode(sourceFile, [
            typescript_1.factory.createExpressionStatement(exports.generateFactory.CREATE_Export_File_Function(sourceFile.statements.flatMap((statementNode) => (0, amdBodyVisitor_1.topLevelVisitor)(statementNode, sourceFile, CTX)), compilerOptions.__Import_Module_Name, moduleInfo.moduleIndex))
        ]);
        if (sourceFile.isCSSFile) {
            sourceFile.fileName = sourceFile.fileName + ".json";
        }
        return sourceFile;
    },
    CREATE_Async_Module_SourceFile_IF_NEEDED(sourceFile, moduleInfo, compilerOptions) {
        const polyfillModuleInfo = utils_2.nodeModuleThree.get(utils_2.codePolyfillPath);
        if (!moduleInfo.isMainAsyncModule) {
            return;
        }
        let accessPropertyes = [
            "u",
        ];
        const outFile = (0, utils_1.getoutFilePath)(path_1.default.relative(App_1.App.__RunDirName, moduleInfo.modulePath));
        if (moduleInfo.isAsyncModule) {
            if (!CompileFile_1.__compiledFilesThreshold.has(moduleInfo.modulePath) && !compilerOptions.__mainFilesPaths.includes(moduleInfo.modulePath)) {
                (0, CompileFile_1.Compiler)([moduleInfo.modulePath], {
                    ...compilerOptions,
                }, {
                    __host: undefined,
                    __moduleThree: compilerOptions.__getLocalModuleThree(moduleInfo.modulePath),
                });
            }
            const asyncModuleCompilerOptions = CompileFile_1.__compiledFilesThreshold.get(moduleInfo.modulePath)?.getCompilerOptions() || {};
            const asyncModuleThreeModuleInfo = asyncModuleCompilerOptions?.__moduleThree?.get(moduleInfo.modulePath);
            accessPropertyes.push(typescript_1.factory.createStringLiteral(asyncModuleCompilerOptions.__Module_Window_Name), typescript_1.factory.createNumericLiteral(asyncModuleThreeModuleInfo.moduleIndex));
        }
        else {
            accessPropertyes.push(typescript_1.factory.createStringLiteral(compilerOptions.__Module_Window_Name), typescript_1.factory.createNumericLiteral(moduleInfo.moduleIndex));
        }
        sourceFile.statements.push(typescript_1.factory.createExpressionStatement(this.CREATE_Token_Nodes([
            this.CREATE_Element_Access_Expression([
                compilerOptions.__Import_Module_Name,
                typescript_1.factory.createStringLiteral(moduleInfo.moduleIndex + "a")
            ]),
            this.CREATE_Arrow_Function_With_Parenthesized_Expression(this.CREATE_CAll_Function(this.CREATE_Element_Access_Expression([
                "window",
                typescript_1.factory.createStringLiteral(polyfillModuleInfo.__Module_Window_Name),
                typescript_1.factory.createNumericLiteral(polyfillModuleInfo.moduleIndex),
                typescript_1.factory.createStringLiteral("A")
            ]), accessPropertyes), ["u"])
        ], typescript_1.default.SyntaxKind.EqualsToken)));
    },
};
