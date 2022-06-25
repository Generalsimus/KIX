import ts from "typescript";
import { CustomContextType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { createObject } from "../../factoryCode/createObject";
import { identifier } from "../../factoryCode/identifier";
import { variableStatement } from "../../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./createBlockVisitor";
import { getIdentifierState } from "./getIdentifierState";
// visitedNode,
// visitedNode.initializer,
// visitedNode.expression,
// blockNode
export const createForInOfVisitor = <N extends ts.ForInStatement | ts.ForOfStatement>(
    updateNode: (
        node: N,
        statement: N["statement"],
        context: CustomContextType,
    ) => N
) => {
    return createBlockVisitor(
        (node: N, visitor: ts.Visitor, context: CustomContextType, variableState: VariableStateType) => {
            const visitedNode = ts.visitEachChild(node, visitor, context);
            const { initializer } = visitedNode
            let propertyDeclaration: Parameters<typeof createObject>[0] = [];
            // initializer.
            if (ts.isVariableDeclarationList(initializer)) {
                for (const variableDeclaration of initializer.declarations) {
                    const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
                    for (const declarationIdentifierName in declarationNamesObject) {
                        const identifierState = getIdentifierState(declarationIdentifierName, context);
                        identifierState.declaredFlag = initializer.flags;
                        const { substituteCallback } = identifierState
                        identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                            propertyDeclaration.push([
                                indexIdToUniqueString,
                                identifier(declarationIdentifierName)
                            ])
                            substituteCallback(indexIdToUniqueString, declarationIdentifier)
                        }
                    }
                }
            }
            console.log("🚀 --> file: ForInStatement.ts --> line 40 --> propertyDeclaration", propertyDeclaration.length);
            if (variableState.blockScopeIdentifiers) {
                let blockNode: ts.Statement = visitedNode.statement
                const variableStateDeclaration = variableStatement([
                    [
                        variableState.blockScopeIdentifiers,
                        createObject(propertyDeclaration)
                    ]
                ]);

                if (ts.isBlock(blockNode)) {
                    blockNode = context.factory.updateBlock(
                        blockNode,
                        [
                            variableStateDeclaration,
                            ...blockNode.statements
                        ]
                    )
                } else {
                    blockNode = context.factory.createBlock([
                        variableStateDeclaration,
                        blockNode
                    ])
                }
                return updateNode(
                    visitedNode,
                    blockNode,
                    context
                )
            }

            return visitedNode
        }
    )
}