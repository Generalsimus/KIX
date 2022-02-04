// TransformersObjectType

import ts from "typescript";
import { App } from "../../app";
import { CustomContextType } from "../";
import { ImportDeclaration } from "./ImportDeclaration";
import { ExportAssignment } from "./ExportAssignment";
import { exportVisitor } from "./exportVisitor";
import { moduleBody } from "../factoryCode/moduleBody";


export const moduleTransformerBefore = {
    [ts.SyntaxKind.ImportDeclaration]: ImportDeclaration,
    [ts.SyntaxKind.ExportAssignment]: ExportAssignment,
    [ts.SyntaxKind.ExportKeyword]: () => { },
    [ts.SyntaxKind.DefaultKeyword]: () => { },
    [ts.SyntaxKind.ExportDeclaration]: () => { },
}
