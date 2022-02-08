import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app";
import { elementAccessExpression } from "../factoryCode/elementAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";

export const useJsxRegistration = (context: CustomContextType) => {
    let registrationName: ts.Identifier | undefined;
    context.getJSXRegistrationDeclarationIdentifier = () => {
        return registrationName || (registrationName = context.factory.createUniqueName("__"))
    }
    return (statements: ts.Statement[]) => {
        
        const importedModuleInfo = App.moduleThree.get(App.injectPaths.propRegistration)
        if (registrationName && importedModuleInfo) {

            statements.splice(0, 0, variableStatement([
                [
                    registrationName,
                    elementAccessExpression([App.uniqAccessKey, importedModuleInfo.moduleIndex + "", "R"])
                ]
            ], ts.NodeFlags.None))

        }
    }
}