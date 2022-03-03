import ts from "typescript";
import { CustomContextType } from ".";
import { jsxToObject } from "./jsx/jsxToObject";
import { PropertyAccessExpressionOrElementAccessExpression } from "./jsx/utils/PropertyAccessExpressionOrElementAccessExpression";
import { visitFunctionDeclarationForJsxRegistration } from "./jsx/utils/visitFunctionDeclarationForJsxRegistration";
import { ExportAssignment } from "./module/ExportAssignment";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./module/sourceFile";
import { VariableStatement } from "./jsx/VariableStatement";
import { Identifier } from "./jsx/Identifier";

export const transformBefore = {
    [ts.SyntaxKind.JsxElement]: (node: ts.JsxElement, visitor: ts.Visitor, context: CustomContextType) => {

        const {
            openingElement: {
                tagName,
                attributes
            },
            children
        } = node;

        return jsxToObject(visitor, context, tagName, attributes, children)
    },
    [ts.SyntaxKind.JsxSelfClosingElement]: (node: ts.JsxSelfClosingElement, visitor: ts.Visitor, context: CustomContextType) => {

        return jsxToObject(visitor, context, node.tagName, node.attributes, [] as any)
    },
    [ts.SyntaxKind.Identifier]: Identifier,
    [ts.SyntaxKind.ArrowFunction]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.FunctionDeclaration]: visitFunctionDeclarationForJsxRegistration,
    [ts.SyntaxKind.PropertyAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ElementAccessExpression]: PropertyAccessExpressionOrElementAccessExpression,
    [ts.SyntaxKind.ImportDeclaration]: () => { },
    [ts.SyntaxKind.ExportAssignment]: () => { },
    [ts.SyntaxKind.ExportAssignment]: ExportAssignment,
    [ts.SyntaxKind.ExportKeyword]: () => { },
    [ts.SyntaxKind.DefaultKeyword]: () => { },
    [ts.SyntaxKind.ExportDeclaration]: () => { },
    [ts.SyntaxKind.VariableStatement]: VariableStatement,
    [ts.SyntaxKind.SourceFile]: visitSourceFileBefore,

}
export const transformAfter = {
    [ts.SyntaxKind.SourceFile]: visitSourceFilesAfter,
}