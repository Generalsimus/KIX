import ts from "typescript";
import { CustomContextType, TransformersObjectType } from "..";
import { getVariableDeclarationNames } from "./getVariableDeclarationNames";


let onSubstituteNodeCache: ((hint: ts.EmitHint, node: ts.Node) => ts.Node) | undefined

export const getVisitor = (transforms: TransformersObjectType, needSubstituteNode: boolean) => (
    context: CustomContextType,
) => {
    const onSubstituteNode = context.onSubstituteNode;
    if (needSubstituteNode) {
        context.onSubstituteNode = (hint: ts.EmitHint, node: ts.Node) => {

            const subNode = context.substituteNodesList.get(node);

            if (subNode) {
                if (hint === ts.EmitHint.Expression || hint === ts.EmitHint.Unspecified || node.kind !== ts.SyntaxKind.Identifier) {

                    node = subNode();
                }
            }
            return onSubstituteNode(hint, node);
        }

    }



    const visitor = (node: ts.Node): ts.Node => {
        // console.log("QQQQQ", ts.SyntaxKind[node.kind]); 

        return ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }


    return visitor

}