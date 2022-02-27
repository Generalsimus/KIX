import ts from "typescript"
import { App } from "../../app"
import { ModuleInfoType } from "../../utils/getModuleInfo"
import { arrowFunction } from "./arrowFunction"
import { callFunction } from "./callFunction"

export const moduleBody = (moduleInfo: ModuleInfoType, statements: ts.Statement[] = []) => {
    return ts.factory.createExpressionStatement(callFunction(App.uniqAccessKey + "_MODULE", [
        ts.factory.createNumericLiteral(moduleInfo.moduleIndex),
        arrowFunction(
            [App.uniqAccessKey + "exports", "module"],
            statements
        )
    ]))
}