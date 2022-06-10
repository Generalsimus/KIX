import ts from "typescript";
import { DeclarationIdentifiersStateType, PreCustomContextType } from "../..";
import { updateVariableStatement } from "./updateVariableStatement";
import { createIdentifierDeclarationNode } from "./utils/createIdentifierDeclarationNode";

export const transformNodeKind = {
    [ts.SyntaxKind.VariableStatement]: updateVariableStatement
}