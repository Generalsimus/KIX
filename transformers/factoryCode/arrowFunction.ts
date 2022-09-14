import ts from "typescript";
import { parameterDeclaration } from "./parameterDeclaration";



export const arrowFunction = (params: (string | ts.BindingName)[] = [], statements: ts.Statement[] = [], returnNode?: ts.Expression) => {
    const factory = ts.factory;
    return factory.createArrowFunction(
        undefined,
        undefined,
        parameterDeclaration(params),
        undefined,
        factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        returnNode ? factory.createParenthesizedExpression(returnNode) : factory.createBlock(
            statements,
            true
        )
    )
}
