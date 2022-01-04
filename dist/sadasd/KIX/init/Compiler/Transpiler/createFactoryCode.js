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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFactory = void 0;
const typescript_1 = __importStar(require("typescript"));
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
        return createCallExpression(typeof CallNameOrNode === "string" ?
            createIdentifier(CallNameOrNode) :
            CallNameOrNode, undefined, Arguments);
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
    CREATE_Export_File_Function(body, __Import_Module_Name, Module_INDEX, ifNeedRunTime) {
        return this.CREATE_CAll_Function(__Import_Module_Name + "_Module", [
            typescript_1.factory.createNumericLiteral(Module_INDEX),
            typescript_1.factory.createArrowFunction(undefined, undefined, this.CREATE_Parameter_Declaration(["exports"]), undefined, typescript_1.factory.createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), typescript_1.factory.createBlock(body, true)),
            ...(ifNeedRunTime ? [typescript_1.factory.createNumericLiteral("1")] : []),
        ]);
    },
    CREATE_Bind_Function(Name, ClildNode, ArgumentsNodes) {
        return typescript_1.factory.createFunctionDeclaration(undefined, undefined, undefined, typescript_1.factory.createIdentifier(Name), undefined, this.CREATE_Parameter_Declaration(ArgumentsNodes), undefined, typescript_1.factory.createBlock(ClildNode, true));
    },
    CREATE_Module_GET_POLYFIL(__Import_Module_Name) {
        return this.CREATE_Bind_Function(__Import_Module_Name + "_Module", [
            typescript_1.factory.createExpressionStatement(typescript_1.factory.createCallExpression(this.CREATE_Property_Access_Expression([
                "Object",
                "defineProperty",
            ]), undefined, [
                typescript_1.factory.createIdentifier(__Import_Module_Name),
                typescript_1.factory.createIdentifier("k"),
                typescript_1.factory.createObjectLiteralExpression([
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier("get"), typescript_1.factory.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, typescript_1.factory.createBlock([
                        typescript_1.factory.createReturnStatement(this.CREATE_Token_Nodes([
                            typescript_1.factory.createIdentifier("e"),
                            this.CREATE_Token_Nodes([
                                typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier("f"), undefined, [
                                    typescript_1.factory.createParenthesizedExpression(this.CREATE_Token_Nodes([
                                        typescript_1.factory.createIdentifier("e"),
                                        typescript_1.factory.createObjectLiteralExpression([], false)
                                    ], typescript_1.default.SyntaxKind.EqualsToken)),
                                ]),
                                typescript_1.factory.createIdentifier("e")
                            ], typescript_1.default.SyntaxKind.CommaToken)
                        ], typescript_1.default.SyntaxKind.BarBarToken)),
                    ], true))),
                ], true),
            ])),
            typescript_1.factory.createExpressionStatement(this.CREATE_Token_Nodes([
                "i",
                this.CREATE_Element_Access_Expression([
                    __Import_Module_Name,
                    "k",
                ])
            ], typescript_1.default.SyntaxKind.AmpersandAmpersandToken)),
        ], [
            "k",
            "f",
            "i",
            "e"
        ]);
    },
};
