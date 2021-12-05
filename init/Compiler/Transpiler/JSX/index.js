import ts, {
    factory,
    visitEachChild,
    getDirectoryPath,
    isNamespaceExport,
    idText,
    createIdentifier,
    normalizeSlashes,
    SyntaxKind,
    getLocalNameForExternalImport,
    collectExternalModuleInfo,
    createIdentifier,
    SignatureKind
} from "typescript"
import { ConvertJsxToObject, PropertyAccessExpressionOrElementAccessExpression, visitFunctionDeclarationForJsxRegistrator } from "./utils";
import { generateFactory } from "../createFactoryCode";




export const JSXTransformersBefore = {
    [SyntaxKind.JsxElement]: (NODE, visitor, CTX) => {
        const {
            openingElement: {
                tagName,
                attributes
            },
            children
        } = NODE;

        return ConvertJsxToObject(visitor, CTX, tagName, attributes, children)
    },
    [SyntaxKind.JsxSelfClosingElement]: (NODE, visitor, CTX) => {

        return ConvertJsxToObject(visitor, CTX, NODE.tagName, NODE.attributes, [])
    },
    // [SyntaxKind.JsxFragment]: ({ children }, visitor, CTX) => {

    //     return ConvertJsxToObject(NODE, visitor, CTX, tagName, attributes, children)
    //     // return FLAT_JSX_CHILDS(children, DATA, VISITOR, CTX)
    // },
    [SyntaxKind.ArrowFunction]: visitFunctionDeclarationForJsxRegistrator,
    [SyntaxKind.FunctionDeclaration]: visitFunctionDeclarationForJsxRegistrator,
    [SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression

}


