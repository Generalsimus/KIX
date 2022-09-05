import ts from "typescript";
import { CustomContextType, TransformersObjectType } from "..";

export const getVisitor = (transforms: TransformersObjectType) => (context: CustomContextType) => {


    const visitor = <N extends ts.Node>(node: N): ts.VisitResult<ts.Node> => {

        return ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }

    return visitor

}