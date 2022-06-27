import ts from "typescript";
import { CustomContextType } from "..";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
// console.log("🚀 --> file: createBlockVisitor.ts --> line 40 --> return --> visitor", ts.SyntaxKind[node.kind], visitor);
const CaseBlockVisitor = createBlockVisitor<ts.SwitchStatement["caseBlock"]>((
    node,
    visitor,
    context,
    variableState) => {
    // console.log("🚀 --> file: SwitchStatement.ts --> line 11 --> visitor", visitor);
    return ts.visitEachChild(node, visitor, context)
});
// TODO: სვიჩისთვის დეკლარაციიის სთეითი არ ემატება მაგრამ შეიძლება საჭიროება იყოს
export const SwitchStatement = (node: ts.SwitchStatement, visitor: ts.Visitor, context: CustomContextType) => {
    // console.log("🚀 --> file: SwitchStatement.ts --> line 14 --> SwitchStatement --> visitor", visitor); 
    // return node
    const expression = visitor(node.expression) as ts.SwitchStatement["expression"];
    const caseBlock = CaseBlockVisitor(node.caseBlock, visitor, context);


    return context.factory.updateSwitchStatement(
        node,
        expression,
        caseBlock
    );
}