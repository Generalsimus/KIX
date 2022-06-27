import ts from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { getIdentifierState } from "./utils/getIdentifierState";
import { getIndexId } from "./utils/getIndexId";

type NodeArgType = {
    initializer: ts.ForStatement['initializer'],
    statement: ts.ForStatement['statement'],

}
const ForBlockVisitor = createBlockVisitor(
    (statement: ts.Statement, visitor: ts.Visitor, context: CustomContextType, variableState: VariableStateType) => {
        // let { initializer, statement, incrementor, condition } = node;
        const visitedStatementNode = visitor(statement) as ts.Statement
        // const IsInitializerDeclaration = initializer && ts.isVariableDeclarationList(initializer)

        return {
            variableState,
            visitedStatementNode
        }
    }
)
export const ForStatement = createBlockVisitor(
    (node: ts.ForStatement, visitor: ts.Visitor, context: CustomContextType, variableState: VariableStateType) => {
        // let { initializer, statement, incrementor, condition } = node;
        let { variableState: blockVariableState, visitedStatementNode: statement } = node.statement && ForBlockVisitor(node.statement, visitor, context);
        Object.assign(variableState, blockVariableState)
        let initializer = node.initializer && visitor(node.initializer) as ts.VariableDeclarationList
        const incrementor = node.incrementor && visitor(node.incrementor) as ts.Expression
        let condition = node.condition && visitor(node.condition) as ts.Expression
        // const statement = visitedStatementNode

        let propertyDeclaration: [ts.Identifier, string, string][] = [];
        const isInitializerDeclaration = initializer && ts.isVariableDeclarationList(initializer)
        if (isInitializerDeclaration) {
            initializer = initializer!
            for (const variableDeclaration of initializer.declarations) {
                const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
                for (const declarationIdentifierName in declarationNamesObject) {
                    const identifierState = getIdentifierState(declarationIdentifierName, context);
                    identifierState.declaredFlag = initializer.flags;
                    const { substituteCallback } = identifierState
                    identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                        propertyDeclaration.push([
                            declarationIdentifier,
                            indexIdToUniqueString,
                            declarationIdentifierName
                        ])
                        substituteCallback(indexIdToUniqueString, declarationIdentifier);
                    }
                }
            }

        // }

        // if (isInitializerDeclaration) {
        //     initializer = initializer!
            if (initializer.flags === ts.NodeFlags.None) {
                const conditionCache = condition;
                condition ||= context.factory.createIdentifier("")
                context.substituteNodesList.set(condition, () => {
                    context.substituteNodesList.delete(condition!)
                    if (propertyDeclaration.length) {
                        const conditionsNodes: ts.Expression[] = propertyDeclaration.map(([declarationIdentifier, propertyName, variableName]) => {
                            return context.factory.createParenthesizedExpression(nodeToken([
                                propertyAccessExpression([declarationIdentifier, propertyName], "createPropertyAccessExpression"),
                                identifier(variableName)
                            ]))
                        });

                        if (conditionCache) {
                            conditionsNodes.push(conditionCache)
                        }
                        if (conditionsNodes.length === 1) {
                            return context.factory.createParenthesizedExpression(conditionsNodes[0]);
                        }

                        return context.factory.createParenthesizedExpression(nodeToken(conditionsNodes, ts.SyntaxKind.CommaToken));
                    }
                    return condition!
                })
            }
        }




        if (variableState.blockScopeIdentifiers) {
            if (initializer?.flags === ts.NodeFlags.Let) {
                initializer = context.factory.updateVariableDeclarationList(
                    initializer,
                    [
                        ...initializer.declarations,
                        context.factory.createVariableDeclaration(
                            variableState.blockScopeIdentifiers,
                            undefined,
                            undefined,
                            undefined,
                        )
                    ]
                );
                const conditionCache = condition;
                condition = context.factory.createParenthesizedExpression(nodeToken([
                    variableState.blockScopeIdentifiers,
                    createObject(propertyDeclaration.map(el => [identifier(el[1]), identifier(el[2])]))
                ]))
                if (conditionCache) {
                    condition = context.factory.createParenthesizedExpression(nodeToken([
                        condition,
                        conditionCache
                    ], ts.SyntaxKind.CommaToken))
                }
            } else {
                if (ts.isBlock(statement)) {
                    statement = context.factory.updateBlock(
                        statement,
                        [
                            variableStatement([
                                [
                                    variableState.blockScopeIdentifiers,
                                    createObject([])
                                ]
                            ]),
                            ...statement.statements
                        ]
                    )
                } else {
                    statement = context.factory.createBlock([
                        variableStatement([
                            [
                                variableState.blockScopeIdentifiers,
                                createObject([])
                            ]
                        ]),
                        statement
                    ])
                }
            }

        }

        return context.factory.updateForStatement(
            node,
            initializer,
            condition,
            incrementor,
            statement
        )
    }
)