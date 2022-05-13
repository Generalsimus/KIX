import ts from "typescript";
import { CustomContextType } from "../..";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getVariableDeclarationNames } from "../../utils/getVariableDeclarationNames";
import { getVariableDeclarationNode } from "../../utils/getVariableDeclarationNode";
import { filterNodeModifiers } from "./filterNodeModifiers";
import { updateClassOrFunctionExport } from "./updateClassOrFunctionExport";

/* 
TODO: ამ ფაილში არაზუსტია ExportDeclaration დანარჩენი ყველაფერი ნორმალურადაა
*/
export const exportVisitor = (node: ts.Statement, context: CustomContextType) => {
    const factory = context.factory;


    // console.log(node.getText());
    // console.log(ts.SyntaxKind[node.kind]);

    switch (node.kind) {
        case ts.SyntaxKind.ExportAssignment:
            if (ts.isExportAssignment(node)) {
                return [
                    factory.createExpressionStatement(
                        nodeToken(
                            [
                                propertyAccessExpression(["exports", "default"]),
                                node.expression
                            ]
                        )
                    )
                ]
            }
            return [node];
        case ts.SyntaxKind.ExportDeclaration:
            /* 
            TODO: მოდულებიდან ექსპორტის სულორტი არ გვაქ მთლიანობაში ExportDeclaration არაზუსტია
            export { import1, import2 }; 
            */
            if (ts.isExportDeclaration(node)) {
                const exportNodes: ts.Statement[] = []
                const exportClause = node.exportClause;
                if (exportClause && ts.isNamedExports(exportClause)) {
                    for (const exportDeclarations of (exportClause.elements || [])) {
                        const declarationNamesObject = getVariableDeclarationNames(exportDeclarations)
                        for (const declarationName in declarationNamesObject) {
                            exportNodes.push(
                                factory.createExpressionStatement(nodeToken([
                                    propertyAccessExpression(["exports", declarationName]),
                                    getVariableDeclarationNode(declarationNamesObject[declarationName])
                                ]))
                            )

                        }
                    }
                }
                return exportNodes
            }
            return [node];
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
            /*
            export function functionName(){ }
            export class ClassName { }

            export default function functionName(){ }
            export default class ClassName { }

            export default function  (){ }
            export default class   { }
            */
            const updateType = ts.isFunctionDeclaration(node) ? "Function" : "Class";

            return updateClassOrFunctionExport(node as any, updateType, factory);
        case ts.SyntaxKind.VariableStatement:
            /* 
            export let name1, name2, …, nameN; // also var, const
            export let name1 = …, name2 = …, …, nameN; // also var, const
            */
            const [isFilteredVariableStatementModifiers, newVariableStatementModifiers] = filterNodeModifiers(node);

            if (isFilteredVariableStatementModifiers && ts.isVariableStatement(node)) {
                const newNodes: ts.Statement[] = [
                    factory.updateVariableStatement(node, newVariableStatementModifiers, node.declarationList)
                ];

                for (const variableDeclaration of node.declarationList.declarations) {
                    const declarationNamesObject = getVariableDeclarationNames(variableDeclaration)
                    for (const variableDefinition in declarationNamesObject) {
                        newNodes.push(
                            factory.createExpressionStatement(
                                nodeToken([
                                    propertyAccessExpression(["exports", variableDefinition]),
                                    factory.createIdentifier(variableDefinition)
                                ])
                            )
                        )

                    }
                };

                return newNodes
            }
            return [node]
    }
    return [node]
}


