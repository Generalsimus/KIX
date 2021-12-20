"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSXTransformersBefore = void 0;
const typescript_1 = require("typescript");
const utils_1 = require("./utils");
exports.JSXTransformersBefore = {
    [typescript_1.SyntaxKind.JsxElement]: (NODE, visitor, CTX) => {
        const { openingElement: { tagName, attributes }, children } = NODE;
        return (0, utils_1.ConvertJsxToObject)(visitor, CTX, tagName, attributes, children);
    },
    [typescript_1.SyntaxKind.JsxSelfClosingElement]: (NODE, visitor, CTX) => {
        return (0, utils_1.ConvertJsxToObject)(visitor, CTX, NODE.tagName, NODE.attributes, []);
    },
    [typescript_1.SyntaxKind.ArrowFunction]: utils_1.visitFunctionDeclarationForJsxRegistrator,
    [typescript_1.SyntaxKind.FunctionDeclaration]: utils_1.visitFunctionDeclarationForJsxRegistrator,
    [typescript_1.SyntaxKind.PropertyAccessExpression]: utils_1.PropertyAccessExpressionOrElementAccessExpression,
    [typescript_1.SyntaxKind.ElementAccessExpression]: utils_1.PropertyAccessExpressionOrElementAccessExpression
};
