import ts from "typescript";
import { CustomContextType, TransformersObjectType } from "..";
import { getVariableDeclarationNames } from "./getVariableDeclarationNames";
const callbackBeforeCreate = () => { }

export const getVisitor = (transforms: TransformersObjectType) => (
    context: CustomContextType,
) => {
    const onSubstituteNode = context.onSubstituteNode;
    context.enableSubstitution(ts.SyntaxKind.Block);
    context.onSubstituteNode = (hint: ts.EmitHint, node: ts.Node) => {

        const subNode = context.substituteNodesList.get(node);
        // if (node.kind === ts.SyntaxKind.Block) {
        //     console.log(node.pos)
        // }
        if (subNode) {
            if (hint === ts.EmitHint.Expression || node.kind !== ts.SyntaxKind.Identifier) {
                node = subNode();
            }
        }
        return onSubstituteNode(hint, node);
    }


    const visitor = (node: ts.Node) => {

        return ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }


    return visitor;

}