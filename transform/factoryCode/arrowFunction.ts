import ts from "typescript";
import { parameterDeclaration } from "./parameterDeclaration";


const factory = ts.factory;

export const arrowFunction = (params: (string | ts.BindingName)[] = [], statements: ts.Statement[] = []) => {
    return factory.createArrowFunction(
        undefined,
        undefined,
        parameterDeclaration(params),
        undefined,
        factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock(
            statements,
            true
        )
    )
}
