import ts from "typescript";
import { CustomContextType } from "..";
import { jsxTransformers } from "../jsx";

export const getVisitor = (transforms: typeof jsxTransformers) => (context: CustomContextType) => {


    const visitor = <N extends ts.Node>(node: N): ts.VisitResult<N> => {

        return ((transforms as any)[node.kind] || ts.visitEachChild)(node, visitor, context)
    }

    return visitor

}