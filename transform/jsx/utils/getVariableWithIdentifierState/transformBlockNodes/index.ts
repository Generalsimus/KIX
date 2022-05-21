import ts from "typescript";
import { CustomContextType } from "../../../..";
import { getBlockNodeData } from "../utils/getBlockNodeData";
import { updateArrowFunction } from "./updateArrowFunction";
import { updateFunctionDeclaration } from "./updateFunctionDeclaration";
import { updateVariableStatement } from "./updateVariableStatement";

type TransformBlockNodeType<N> = (
    node: N,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => ts.Node


type BlockNodeTransforms = TransformBlockNodeType<ts.ArrowFunction> | TransformBlockNodeType<ts.FunctionDeclaration>

export const transformBlockNodes: Partial<Record<ts.SyntaxKind, BlockNodeTransforms>> = {
    [ts.SyntaxKind.ArrowFunction]: updateArrowFunction,
    [ts.SyntaxKind.FunctionDeclaration]: updateFunctionDeclaration

}

export const transformNodes: Partial<Record<ts.SyntaxKind, (
    node: ts.VariableStatement,
    context: CustomContextType,
    substituteBlockData: ReturnType<typeof getBlockNodeData>
) => ts.Node[]>> = {
    [ts.SyntaxKind.VariableStatement]: updateVariableStatement
} 