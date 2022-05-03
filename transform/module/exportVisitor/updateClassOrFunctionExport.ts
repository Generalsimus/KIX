import ts from "typescript";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { filterNodeModifiers } from "./filterNodeModifiers";

export const updateClassOrFunctionExport = <
    T extends "Function" | "Class",
    N extends T extends "Function" ? ts.FunctionDeclaration : ts.ClassDeclaration
>(node: N, type: T, factory: ts.NodeFactory) => {
    /*
             export function functionName(){...}
    */
    const [isExportModifierFiltered, newExportModifierFilters] = filterNodeModifiers(node);
    if (isExportModifierFiltered) {
        var [isExportDefaultModifierFiltered, newExportDefaultModifierFilters] = filterNodeModifiers({ modifiers: newExportModifierFilters }, ts.SyntaxKind.DefaultKeyword);
        // const uniqueExportIdentifier = factory.createUniqueName("__")
        const declarationName = node.name
        const exportKey = declarationName ? ts.idText(declarationName) : "default";
        const nodeIsFunctionDeclaration = ts.isFunctionDeclaration(node)
        if (declarationName) {
            const updatedNode = nodeIsFunctionDeclaration ? factory.updateFunctionDeclaration(
                node,
                node.decorators,
                newExportDefaultModifierFilters,
                node.asteriskToken,
                node.name,
                node.typeParameters,
                node.parameters,
                node.type,
                node.body,
            ) : factory.updateClassDeclaration(
                node,
                node.decorators,
                newExportDefaultModifierFilters,
                node.name,
                node.typeParameters,
                node.heritageClauses,
                node.members
            );
            return [
                updatedNode,
                factory.createExpressionStatement(
                    nodeToken([
                        propertyAccessExpression(["exports", isExportDefaultModifierFiltered ? "default" : exportKey]),
                        identifier(exportKey)
                    ])
                )
            ]
        } else {
            const newNode = nodeIsFunctionDeclaration ? factory.createFunctionExpression(
                newExportDefaultModifierFilters,
                node.asteriskToken,
                node.name,
                node.typeParameters,
                node.parameters,
                node.type,
                node.body || factory.createBlock([])
            ) : factory.createClassExpression(
                node.decorators,
                newExportDefaultModifierFilters,
                node.name,
                node.typeParameters,
                node.heritageClauses,
                node.members
            );
            return [
                factory.createExpressionStatement(
                    nodeToken([
                        propertyAccessExpression(["exports", exportKey]),
                        newNode
                    ])
                )
            ]
        }

    }
    return [node]
}
