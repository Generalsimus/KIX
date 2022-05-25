import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateArrowFunction } from "./updateArrowFunction";
import { updateClassStaticBlockDeclaration } from "./updateClassStaticBlockDeclaration";
import { updateFunctionDeclaration } from "./updateFunctionDeclaration";
import { updateFunctionExpression } from "./updateFunctionExpression";
import { updateIfStatement } from "./updateIfStatement";
import { updateMethodDeclaration } from "./updateMethodDeclaration";
import { updateSwitchStatement } from "./updateSwitchStatement";
import { updateTryStatement } from "./updateTryStatement";
import { updateVariableStatement } from "./updateVariableStatement";

type TransformBlockNodeType<N> = (
    node: N,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => N


type BlockNodeTransforms = TransformBlockNodeType<ts.ArrowFunction> |
    TransformBlockNodeType<ts.FunctionDeclaration> |
    TransformBlockNodeType<ts.FunctionExpression> |
    TransformBlockNodeType<ts.IfStatement> |
    TransformBlockNodeType<ts.SwitchStatement> |
    TransformBlockNodeType<ts.TryStatement> |
    TransformBlockNodeType<ts.MethodDeclaration> |
    TransformBlockNodeType<ts.ClassStaticBlockDeclaration>

export const transformBlockNodes: Partial<Record<ts.SyntaxKind, BlockNodeTransforms>> = {
    [ts.SyntaxKind.ArrowFunction]: updateArrowFunction,
    [ts.SyntaxKind.FunctionDeclaration]: updateFunctionDeclaration,
    [ts.SyntaxKind.FunctionExpression]: updateFunctionExpression,
    [ts.SyntaxKind.IfStatement]: updateIfStatement,
    [ts.SyntaxKind.SwitchStatement]: updateSwitchStatement,
    [ts.SyntaxKind.TryStatement]: updateTryStatement,
    [ts.SyntaxKind.MethodDeclaration]: updateMethodDeclaration,
    [ts.SyntaxKind.ClassStaticBlockDeclaration]: updateClassStaticBlockDeclaration


}
// ts.SyntaxKind.IfStatement
export const transformNodes: Partial<Record<ts.SyntaxKind, (
    node: ts.VariableStatement,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => ts.Node[]>> = {
    [ts.SyntaxKind.VariableStatement]: updateVariableStatement
} 