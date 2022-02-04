import ts from "typescript"

export function topLevelVisitor(node: ts.Node, currentSourceFile: ts.SourceFile, context: ts.TransformationContext) {
    // console.log("🚀 --> file: amdBodyVisitor.js --> line 9 --> topLevelVisitor --> node.kind", node.kind, SyntaxKind[node.kind]);
    switch (node.kind) {
        // case SyntaxKind.ImportDeclaration:
        //     return visitImportDeclaration(node, currentSourceFile, CTX);
        // // case 263:
        // //     return visitImportEqualsDeclaration(node);
        // case SyntaxKind.ExportDeclaration:
        //     return visitExportDeclaration(node, CTX)
        // case SyntaxKind.ExportAssignment:
        //     return visitExportAssignment(node)
        // case SyntaxKind.FirstStatement:
        //     return visitVariableStatement(node);
        // case SyntaxKind.FunctionDeclaration:
        //     return visitFunctionDeclaration(node)
        // case SyntaxKind.ClassDeclaration:
        //     return visitClassDeclaration(node)
        // case 347:
        //     return visitMergeDeclarationMarker(node);
        // case 348:
        //     return visitEndOfDeclarationMarker(node);
        default:
            return [node];
    }
}

function visitImportDeclaration(node: ts.ImportDeclaration) {

}