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
const utils_1 = require("../../../Helpers/utils");
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createBlock, createIdentifier, createPropertyAccessExpression, createObjectLiteralExpression, createParameterDeclaration, createParenthesizedExpression, createArrowFunction, createCallExpression, createObjectBindingPattern, createBindingElement, createExpressionStatement, createElementAccessExpression, createForInStatement, createPropertyAssignment, createStringLiteral, createSpreadAssignment, createUniqueName, createReturnStatement } = typescript_1.factory;
const { PlusToken, EqualsToken } = typescript_1.SyntaxKind;
exports.generateFactory = {
    CREATE_Plus_Token_Nodes: (Nodes) => {
        return exports.generateFactory.CREATE_Token_Nodes(Nodes, PlusToken);
    },
    CREATE_Equals_Token_Nodes: (Nodes) => {
        return exports.generateFactory.CREATE_Token_Nodes(Nodes, EqualsToken);
    },
    CREATE_Token_Nodes: (Nodes, Token) => {
        return Nodes.reduce((NodeA, NodeB) => {
            return createBinaryExpression(NodeA, createToken(Token), NodeB);
        });
    },
    CREATE_Arrow_Function_With_Parenthesized_Expression: (ClildNode, ArgumentsNodes) => {
        return createArrowFunction(undefined, undefined, ArgumentsNodes.map((argNode) => createParameterDeclaration(undefined, undefined, undefined, argNode, undefined, undefined, undefined)), undefined, createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), typescript_1.factory.createParenthesizedExpression(ClildNode));
    },
    CREATE_Prop_Registrator_For_Attribute: (newNode, getRegistratorName) => exports.generateFactory.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [
        createUniqueName("__node"),
        createUniqueName("__atrName"),
        getRegistratorName
    ]),
    CREATE_Prop_Registrator_For_Child: (newNode, getRegistratorName) => exports.generateFactory.CREATE_Arrow_Function_With_Parenthesized_Expression(newNode, [
        createUniqueName("__node"),
        getRegistratorName
    ]),
    CREATE_Object_Binding_Pattern: (namesObject, returnValue = []) => {
        for (const nameKey in namesObject) {
            const value = namesObject[nameKey];
            returnValue.push(createBindingElement(undefined, value && createIdentifier(nameKey), value && exports.generateFactory.CREATE_Object_Binding_Pattern(value) || createIdentifier(nameKey), undefined));
        }
        return createObjectBindingPattern(returnValue);
    },
    CREATE_CAll_Function: (CallNameOrNode, Arguments) => {
        return createCallExpression(typeof CallNameOrNode === "string" ? createIdentifier(CallNameOrNode) : CallNameOrNode, undefined, Arguments);
    },
    CREATE_Const_Variable: (Nodes) => {
        return createVariableStatement(undefined, createVariableDeclarationList(Nodes.map(([NameNode, ValueNode]) => {
            return createVariableDeclaration(NameNode, undefined, undefined, ValueNode);
        }), typescript_1.default.NodeFlags.Const));
    },
    CREATE_Object_WiTH_String_Keys: (Nodes) => {
        return createObjectLiteralExpression(Nodes.map((ArgNodesOrNode) => (ArgNodesOrNode instanceof Array ? createPropertyAssignment.apply(null, ArgNodesOrNode) : ArgNodesOrNode), false));
    },
    CREATE_Spread_Assignment: (Node) => {
        return createSpreadAssignment(createParenthesizedExpression(Node));
    },
    CREATE_Assign_Polyfil: (AppNameNode, Nodes) => {
        return exports.generateFactory.CREATE_Const_Variable([[
                AppNameNode,
                createArrowFunction(undefined, undefined, [
                    createParameterDeclaration(undefined, undefined, undefined, createIdentifier("n"), undefined, undefined, undefined),
                    createParameterDeclaration(undefined, undefined, undefined, createIdentifier("s"), undefined, undefined, undefined)
                ], undefined, createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), createBlock([createForInStatement(createVariableDeclarationList([createVariableDeclaration(createIdentifier("o"), undefined, undefined, undefined)], typescript_1.default.NodeFlags.Const), createIdentifier("s"), createBlock([createExpressionStatement(createBinaryExpression(createElementAccessExpression(createIdentifier("n"), createIdentifier("o")), createToken(typescript_1.default.SyntaxKind.EqualsToken), createElementAccessExpression(createIdentifier("s"), createIdentifier("o"))))], false))], false))
            ]]);
    },
    CREATE_Property_Access_Expression: (propertys) => {
        return propertys.reduce((propName1, propName2) => {
            return createPropertyAccessExpression(typeof propName1 === "string" ? createIdentifier(propName1) : propName1, typeof propName2 === "string" ? createIdentifier(propName2) : propName2);
        });
    },
    CREATE_Property_Access_Equals_Token: (Node, decoratorPropertys = []) => {
        return exports.generateFactory.CREATE_Equals_Token_Nodes([
            exports.generateFactory.CREATE_Property_Access_Expression(decoratorPropertys),
            Node
        ]);
    },
    CREATE_Export_File_Function: (body, Import_Module_Name, FILE_INDEX) => {
        body.push(createReturnStatement(createIdentifier("exports")));
        return exports.generateFactory.CREATE_Property_Access_Equals_Token(createCallExpression(createParenthesizedExpression(createArrowFunction(undefined, undefined, [createParameterDeclaration(undefined, undefined, undefined, createIdentifier("exports"), undefined, undefined, undefined)], undefined, createToken(typescript_1.default.SyntaxKind.EqualsGreaterThanToken), createBlock(body, true))), undefined, [createObjectLiteralExpression([], false)]), [Import_Module_Name, (0, utils_1.getColumnName)(FILE_INDEX)]);
    }
};
//# sourceMappingURL=createFactoryCode.js.map