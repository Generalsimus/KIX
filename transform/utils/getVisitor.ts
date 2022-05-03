import ts from "typescript";
import { TransformersObjectType } from "..";
import { getVariableDeclarationNames } from "./getVariableDeclarationNames";
import { visitEachChildPolyfill } from "./visitEachChild";

export const getVisitor = (transforms: TransformersObjectType) => (context: ts.TransformationContext) => {

    // context.enableSubstitution(ts.SyntaxKind.VariableStatement);
    // context.onSubstituteNode = (hint: ts.EmitHint, node: ts.Node) => {
    //     // if (ts.isIdentifier(node)) {

    //     //     console.log("🚀 --> file: isIdentifier", node.escapedText);
    //     // }
    //     // if (ts.isVariableStatement(node)) {
    //     //     for (const variableDeclaration of node.declarationList.declarations) {

    //     //         const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
    //     //         console.log("🚀 --> file: getVisitor.ts --> line 12 --> getVisitor --> declarationNamesObject", declarationNamesObject);

    //     //     }
    //     //     return ts.createIdentifier(`sssssssss`);
    //     // }
    //     return node;
    // }


    // }
    // if (hint === ts.EmitHint.IdentifierName) {

    //     console.log("🚀 --> file: getVisitor.ts --> line 8 --> getVisitor --> node", node.);
    // }
    // return node;
    // }

    const visitor = (node: ts.Node) => {



        return (context as any).currentParentAstNode = ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }

    return visitor

}