"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSXTransformersBefore = void 0;
const typescript_1 = require("typescript");
const utils_1 = require("./utils");
const createFactoryCode_1 = require("../createFactoryCode");
const { CREATE_CAll_Function } = createFactoryCode_1.generateFactory;
const { createStringLiteral } = typescript_1.factory;
exports.JSXTransformersBefore = {
    [typescript_1.SyntaxKind.JsxElement]: (NODE, visitor, CTX) => {
        const { openingElement: { tagName, attributes }, children } = NODE;
        return (0, utils_1.ConvertJsxToObject)(visitor, CTX, tagName, attributes, children);
    },
    [typescript_1.SyntaxKind.JsxSelfClosingElement]: (NODE, visitor, CTX) => {
        return (0, utils_1.ConvertJsxToObject)(visitor, CTX, NODE.tagName, NODE.attributes, []);
    },
    // [SyntaxKind.JsxFragment]: ({ children }, visitor, CTX) => {
    //     return ConvertJsxToObject(NODE, visitor, CTX, tagName, attributes, children)
    //     // return FLAT_JSX_CHILDS(children, DATA, VISITOR, CTX)
    // },
    [typescript_1.SyntaxKind.PropertyAccessExpression]: utils_1.PropertyAccessExpressionOrElementAccessExpression,
    [typescript_1.SyntaxKind.ElementAccessExpression]: utils_1.PropertyAccessExpressionOrElementAccessExpression
};
//# sourceMappingURL=index.js.map