import ts from "typescript";
import { CustomContextType } from "..";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

const CaseBlockVisitor = createBlockVisitor<ts.SwitchStatement["caseBlock"]>(ts.visitEachChild);
// TODO: სვიჩისთვის დეკლარაციიის სთეითი არ ემატება მაგრამ შეიძლება საჭიროება იყოს
export const SwitchStatement = (node: ts.SwitchStatement, visitor: ts.Visitor, context: CustomContextType) => {
    const expression = visitor(node.expression) as ts.SwitchStatement["expression"];
    const caseBlock = CaseBlockVisitor(node.caseBlock, visitor, context);


    return context.factory.updateSwitchStatement(
        node,
        expression,
        caseBlock
    );
}