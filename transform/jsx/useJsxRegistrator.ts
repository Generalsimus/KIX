import ts from "typescript";
import { CustomContextType } from "..";
import { variableStatement } from "../factoryCode/variableStatement";

export const useJsxRegistration = (context: CustomContextType) => {
    let registrationName: ts.Identifier | undefined;
    context.getJSXRegistrationDeclarationIdentifier = () => {
        return registrationName || (registrationName = context.factory.createUniqueName("__"))
    }
    return (statements: ts.Statement[]) => {
        if (registrationName) {
            statements.splice(0, 0, variableStatement([
                [registrationName, registrationName]
            ]))
        }
    }
}