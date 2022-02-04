import ts from "typescript";
import { visitSourceFileBefore, visitSourceFilesAfter } from "./visitSourceFile";

export const globalTransformersBefore = {
    [ts.SyntaxKind.SourceFile]: visitSourceFileBefore
}


export const globalTransformersAfter = {
    [ts.SyntaxKind.SourceFile]: visitSourceFilesAfter
}