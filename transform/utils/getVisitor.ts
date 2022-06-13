import ts from "typescript";
import { CustomContextType, TransformersObjectType } from "..";
import { getVariableDeclarationNames } from "./getVariableDeclarationNames";
const callbackBeforeCreate = () => { }

export const getVisitor = (transforms: TransformersObjectType) => (
    context: CustomContextType,
) => {
    const onSubstituteNode = context.onSubstituteNode;
    // context.enableSubstitution(ts.SyntaxKind.FunctionDeclaration);
    // context.enableSubstitution(ts.SyntaxKind.ArrowFunction);
    // context.enableSubstitution(ts.SyntaxKind.IfStatement);

    context.onSubstituteNode = (hint: ts.EmitHint, node: ts.Node) => {

        // console.log("🚀 --> file: getVisitor.ts --> line 17 -->  context.substituteNodesList",  context.substituteNodesList);
        const subNode = context.substituteNodesList.get(node);
        // if (node.kind === ts.SyntaxKind.Block) {
        //     console.log(node.pos)
        // }
        if (subNode) {
            // console.log("🚀 --> file: getVisitor.ts --> line 22 --> subNode", ts.EmitHint[hint], node);
            if (hint === ts.EmitHint.Expression || hint === ts.EmitHint.Unspecified || node.kind !== ts.SyntaxKind.Identifier) {

                node = subNode();
            }
        }
        return onSubstituteNode(hint, node);
    }


    const visitor = (node: ts.Node): ts.Node => {
        // console.log("QQQQQ", ts.SyntaxKind[node.kind]);
        // return node
        return ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }


    return visitor;

}