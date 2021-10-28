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
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createNumericLiteral, createIdentifier, createPropertyAccessExpression } = typescript_1.factory;
const { PlusToken } = typescript_1.SyntaxKind;
exports.generateFactory = {
    CREATE_Plus_Token_Nodes: (Nodes) => {
        return Nodes.reduce((NodeA, NodeB) => {
            return createBinaryExpression(NodeA, createToken(PlusToken), NodeB);
        });
    },
    CREATE_Const_Variable: (Nodes) => {
        return createVariableStatement(undefined, createVariableDeclarationList(Nodes.map(([NameNode, ValueNode]) => {
            return createVariableDeclaration(NameNode, undefined, undefined, ValueNode);
        }), typescript_1.default.NodeFlags.Const));
    },
    CREATE_Property_Access_Expression: (propertys) => {
        return createPropertyAccessExpression(...propertys.map((propetyName) => createIdentifier(propetyName)));
    },
    CREATE_Export_File_Function: (body, FILE_INDEX, Import_Module_Name) => {
        body.push(typescript_1.factory.createReturnStatement(typescript_1.factory.createIdentifier("exports")));
        return createBinaryExpression(exports.generateFactory.CREATE_Property_Access_Expression([Import_Module_Name, (0, utils_1.getColumnName)(FILE_INDEX)]), typescript_1.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.factory.createCallExpression(typescript_1.factory.createParenthesizedExpression(typescript_1.factory.createFunctionExpression(undefined, undefined, undefined, undefined, [typescript_1.factory.createParameterDeclaration(undefined, undefined, undefined, typescript_1.factory.createIdentifier("exports"), undefined, undefined, undefined)], undefined, typescript_1.factory.createBlock(body, true))), undefined, [typescript_1.factory.createObjectLiteralExpression([], false)]));
    }
};
//# sourceMappingURL=createFactory.js.map