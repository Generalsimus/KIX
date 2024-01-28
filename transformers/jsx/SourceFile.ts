import ts from "typescript";
import { CustomContextType } from "..";
import { moduleSourceFileBodyVisitor } from "./utils/moduleSourceFileBodyVisitor";

export const SourceFile = (node: ts.SourceFile, visitor: ts.Visitor, context: CustomContextType) => {
    if (ts.ScriptTarget.JSON === node.languageVersion) return node;

    const substituteNodesList = context.substituteNodesList = new Map();

    context.addDeclaredIdentifierState = () => { }
    context.addIdentifiersChannelCallback = () => { }

    node = moduleSourceFileBodyVisitor(node, visitor, context);
    if (substituteNodesList.size) {
        const replaceNodesVisitor = (node: ts.Node) => {
            return (substituteNodesList.get(node) || ts.visitEachChild)?.(node, replaceNodesVisitor, context);
        }
        node = ts.visitEachChild(node, replaceNodesVisitor, context);
        substituteNodesList.clear();
    }

    return node
}