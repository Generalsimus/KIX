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
    ts.transform
    const [isExportModifierFiltered, newExportModifierFilters] = filterNodeModifiers(ts.getModifiers(node));
    if (isExportModifierFiltered) {
        var [isExportDefaultModifierFiltered, newExportDefaultModifierFilters] = filterNodeModifiers(newExportModifierFilters, ts.SyntaxKind.DefaultKeyword);
        // const uniqueExportIdentifier = factory.createUniqueName("__")
        const declarationName = node.name
        const exportKey = declarationName ? ts.idText(declarationName) : "default";
        const nodeIsFunctionDeclaration = ts.isFunctionDeclaration(node)
        if (declarationName) {
            const updatedNode = ts.isFunctionDeclaration(node) ? factory.updateFunctionDeclaration(
                node,
                newExportDefaultModifierFilters,
                node.asteriskToken,
                node.name,
                node.typeParameters,
                node.parameters,
                node.type,
                node.body,
            ) : factory.updateClassDeclaration(
                node,
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
