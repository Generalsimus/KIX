// TransformersObjectType

import ts from "typescript";
import { App } from "../../app";
import { CustomContextType } from "../";
import { ExportAssignment } from "./ExportAssignment";
import { exportVisitor } from "./exportVisitor";
import { moduleBody } from "../factoryCode/moduleBody";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./sourceFile";


export const moduleTransformerBefore = {
    [ts.SyntaxKind.ImportDeclaration]: () => { },
    [ts.SyntaxKind.ExportAssignment]: ExportAssignment,
    [ts.SyntaxKind.ExportKeyword]: () => { },
    [ts.SyntaxKind.DefaultKeyword]: () => { },
    [ts.SyntaxKind.ExportDeclaration]: () => { },
    [ts.SyntaxKind.SourceFile]: visitSourceFileBefore,
}

export const moduleTransformerAfter = {
    [ts.SyntaxKind.SourceFile]: visitSourceFilesAfter,
}