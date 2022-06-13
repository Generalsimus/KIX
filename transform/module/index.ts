// TransformersObjectType

import ts from "typescript";
import { createLowLevelBlockVisitor } from "../jsx";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./sourceFile";


export const moduleTransformerBefore = {
    [ts.SyntaxKind.SourceFile]: createLowLevelBlockVisitor(visitSourceFileBefore)
    //  visitSourceFileBefore,
}

export const moduleTransformerAfter = {
    [ts.SyntaxKind.SourceFile]: visitSourceFilesAfter,
}