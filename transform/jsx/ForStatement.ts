import ts, { visitEachChild } from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { createObject } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { getIdentifierState } from "./utils/getIdentifierState";
import { getIndexId } from "./utils/getIndexId";



export const ForStatement = createBlockVisitor(
    (node: ts.ForStatement, visitor: ts.Visitor, context: CustomContextType, variableState: VariableStateType) => {
        const returnValue: ts.Node[] = [];
        let propertyDeclaration: Parameters<typeof createObject>[0] = [];
        let { initializer, statement, incrementor, condition } = node;
        const IsInitializerDeclaration = initializer && ts.isVariableDeclarationList(initializer)

        if (IsInitializerDeclaration) {
            initializer = initializer as ts.VariableDeclarationList
            if (initializer.flags === ts.NodeFlags.None) {
                const variableStatement = visitor(context.factory.createVariableStatement(
                    [],
                    initializer
                )) as ts.Node;
                if (variableStatement instanceof Array) {
                    returnValue.push(...variableStatement);
                } else {
                    returnValue.push(variableStatement);
                }
                initializer = undefined
                statement = visitor(statement) as ts.Statement
                incrementor = incrementor && visitor(incrementor) as ts.Expression
                condition = condition && visitor(condition) as ts.Expression
            } else {
                initializer = visitor(initializer) as ts.VariableDeclarationList
                statement = visitor(statement) as ts.Statement
                incrementor = incrementor && visitor(incrementor) as ts.Expression
                condition = condition && visitor(condition) as ts.Expression
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
        } else {
            initializer = initializer && visitor(initializer) as ts.ForInitializer
            statement = visitor(statement) as ts.Statement
            incrementor = incrementor && visitor(incrementor) as ts.Expression
            condition = condition && visitor(condition) as ts.Expression
        }

        // initializerIsDeclaration

        if (variableState.blockScopeIdentifiers) {
            if (IsInitializerDeclaration) {
                initializer = initializer as ts.VariableDeclarationList
                initializer = context.factory.updateVariableDeclarationList(initializer, [
                    ...initializer.declarations,
                    context.factory.createVariableDeclaration(variableState.blockScopeIdentifiers)
                ])
            } else {
                initializer = initializer as ts.Expression | undefined

                initializer = context.factory.createVariableDeclarationList([
                    context.factory.createVariableDeclaration(
                        variableState.blockScopeIdentifiers,
                        undefined,
                        undefined,
                        initializer
                    )
                ], ts.NodeFlags.Const);
            }
            const equalNode = nodeToken([
                variableState.blockScopeIdentifiers,
                createObject(propertyDeclaration)
            ]);

            if (condition) {
                condition = context.factory.createParenthesizedExpression(nodeToken(
                    [
                        equalNode,
                        condition
                    ],
                    ts.SyntaxKind.CommaToken
                ));
            } else {
                condition = context.factory.createParenthesizedExpression(equalNode);
            }

        }




        returnValue.push(context.factory.updateForStatement(
            node,
            initializer,
            condition,
            incrementor,
            statement
        ))
        return returnValue;
    }
)