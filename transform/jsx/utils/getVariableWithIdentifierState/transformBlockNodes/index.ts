import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateArrowFunction } from "./updateArrowFunction";
import { updateFunctionDeclaration } from "./updateFunctionDeclaration";
import { updateFunctionExpression } from "./updateFunctionExpression";
import { updateIfStatement } from "./updateIfStatement";
import { updateSwitchStatement } from "./updateSwitchStatement";
import { updateVariableStatement } from "./updateVariableStatement";

type TransformBlockNodeType<N> = (
    node: N,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => ts.Node


type BlockNodeTransforms = TransformBlockNodeType<ts.ArrowFunction> |
    TransformBlockNodeType<ts.FunctionDeclaration> |
    TransformBlockNodeType<ts.FunctionExpression> |
    TransformBlockNodeType<ts.IfStatement> |
    TransformBlockNodeType<ts.SwitchStatement>

export const transformBlockNodes: Partial<Record<ts.SyntaxKind, BlockNodeTransforms>> = {
    [ts.SyntaxKind.ArrowFunction]: updateArrowFunction,
    [ts.SyntaxKind.FunctionDeclaration]: updateFunctionDeclaration,
    [ts.SyntaxKind.FunctionExpression]: updateFunctionExpression,
    [ts.SyntaxKind.IfStatement]: updateIfStatement,
    [ts.SyntaxKind.SwitchStatement]: updateSwitchStatement

}
// ts.SyntaxKind.IfStatement
export const transformNodes: Partial<Record<ts.SyntaxKind, (
    node: ts.VariableStatement,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => ts.Node[]>> = {
    [ts.SyntaxKind.VariableStatement]: updateVariableStatement
} 