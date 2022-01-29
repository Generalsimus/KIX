// TransformersObjectType

import ts, { factory, Statement } from "typescript";
import { CustomContextType } from "..";
import { jsxToObject } from "./jsxToObject";


export const jsxTransformers = {
    [ts.SyntaxKind.JsxElement]: (node: ts.JsxElement, visitor: ts.Visitor, context: CustomContextType) => {
        // if(node.kind !== ts.SyntaxKind.JsxElement) 
        // const ss = node
        // node.openingElement.attributes.properties 
        const {
            openingElement: {
                tagName,
                attributes
            },
            children
        } = node;

        // console.log("🚀 --> file: index.ts --> line 17 --> tagName", tagName);
        return jsxToObject(visitor, context, tagName, attributes, children)
    },
    // [ts.SyntaxKind.JsxSelfClosingElement]: (NODE, visitor, CTX) => {

    //     return ConvertJsxToObject(visitor, CTX, NODE.tagName, NODE.attributes, [])
    // },
    // [ts.SyntaxKind.ExportKeyword]: () => { },
    // [ts.SyntaxKind.SourceFile]: (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {


    //     // return ts.visitEachChild(returnNode, visitor, context);
    // },

}  
