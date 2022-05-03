// TransformersObjectType

import ts from "typescript";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./sourceFile";


export const moduleTransformerBefore = {
    [ts.SyntaxKind.SourceFile]: visitSourceFileBefore,
}

export const moduleTransformerAfter = {
    [ts.SyntaxKind.SourceFile]: visitSourceFilesAfter,
}