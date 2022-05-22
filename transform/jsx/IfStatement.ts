// import ts from "typescript";
// import { CustomContextType } from "..";
// import { asyncBlockNodeVisitor, createSubstituteBlockVisitor } from "./utils/substituteBlockVisitors";

// export const IfStatement = (node: ts.IfStatement, visitor: ts.Visitor, context: CustomContextType) => {
//     // createSubstituteBlockVisitor(childVisitor), 
//     const blockVisitor = createSubstituteBlockVisitor(childVisitor);
//     const [thenStatement, setThenStatementBlockNode] = asyncBlockNodeVisitor(node.thenStatement, visitor, context);
//     const [elseStatement, setElseStatementBlockNode] = node.elseStatement ? asyncBlockNodeVisitor(node.elseStatement, visitor, context) : [];
//     // const [thenStatement, setBlockNode] = asyncBlockNodeVisitor(node.thenStatement, visitor, context);
//     // const thenStatement = blockNodeVisitor(node.thenStatement, visitor, context) as ts.Statement
//     // const elseStatement = node.elseStatement && (blockVisitor(node.elseStatement, visitor, context) as ts.Statement)
//     // console.log(ts.SyntaxKind[(thenStatement as any)?.["kind"]], ts.SyntaxKind[(node.thenStatement as any)?.["kind"]])
//     const blockNode = context.factory.updateIfStatement(
//         node,
//         visitor(node.expression) as ts.Expression,
//         thenStatement as ts.Statement,
//         elseStatement as ts.Statement | undefined
//     )
//     setThenStatementBlockNode(blockNode);
//     setElseStatementBlockNode && setElseStatementBlockNode(blockNode);
//     return blockNode
// }