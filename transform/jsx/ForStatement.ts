import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { newBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
// import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
// import { getIdentifierState } from "./utils/getIdentifierState";

type DefaultDeclarationsType = [string, string][]
const ForStatementBlockVisitor = newBlockVisitor(<N extends ts.ForStatement>(node: N, visitor: ts.Visitor, context: CustomContextType) => {
    const { initializer } = node
    const defaultDeclarations: DefaultDeclarationsType = []
    if (initializer && ts.isVariableDeclarationList(initializer)) {
        for (const variableDeclaration of initializer.declarations) {
            const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
            for (const declarationIdentifierName in declarationNamesObject) {
                context.addDeclaredIdentifierState(declarationIdentifierName);
                context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                    // console.log("🚀 --> file: ForStatement.ts --> line 24 --> context.addIdentifiersChannelCallback --> identifierState", identifierState);
                    identifierState.declaredFlag = initializer.flags;
                    const { substituteCallback } = identifierState
                    identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                        if (initializer.flags !== ts.NodeFlags.None) {
                            defaultDeclarations.push([
                                indexIdToUniqueString, declarationIdentifierName
                            ]);
                        }
                        substituteCallback(indexIdToUniqueString, declarationIdentifier)
                    }
                });
            }
        }
    }
    return {
        defaultDeclarations,
        statement: visitor(node.statement)
    }
}, false);

export const ForStatement = (node: ts.ForStatement, visitor: ts.Visitor, context: CustomContextType) => {
    const [{ statement, defaultDeclarations }, variableState] = ForStatementBlockVisitor(node, visitor, context);
    // const initializer = node.initializer && visitor(node.initializer);
    // const condition = node.condition && visitor(node.condition);
    // const incrementor = node.incrementor && visitor(node.incrementor);
    const initialDeclarationMarker = context.factory.createIdentifier("");
    const { initializer, condition, incrementor } = updateForElements(
        (node.initializer && visitor(node.initializer)) as typeof node.initializer,
        (node.condition && visitor(node.condition)) as typeof node.condition,
        (node.incrementor && visitor(node.incrementor)) as typeof node.incrementor,
        initialDeclarationMarker,
        variableState,
        defaultDeclarations,
        context
    )

    return [
        initialDeclarationMarker,
        context.factory.updateForStatement(
            node,
            initializer,
            condition,
            incrementor,
            statement as typeof node.statement
        )
    ]
}
/*
for(initializer,condition,incrementor){

}
*/
const updateForElements = (
    initializer: ts.ForStatement["initializer"],
    condition: ts.ForStatement["condition"],
    incrementor: ts.ForStatement["incrementor"],
    initialDeclarationMarker: ts.Identifier,
    { blockScopeIdentifiers }: VariableStateType,
    defaultDeclarations: DefaultDeclarationsType,
    context: CustomContextType
) => {
    if (!blockScopeIdentifiers) {
        return {
            initializer,
            condition,
            incrementor,
        }
    }
    const variableDeclarationNode = context.factory.createVariableDeclaration(
        blockScopeIdentifiers,
        undefined,
        undefined,
        // createObject([])
    );
    if (initializer && ts.isVariableDeclarationList(initializer)) {
        if (initializer.flags === ts.NodeFlags.None) {
            const currentInitializer = initializer
            context.substituteNodesList.set(initialDeclarationMarker, () => {
                return context.factory.createVariableStatement(
                    undefined,
                    context.factory.updateVariableDeclarationList(
                        currentInitializer,
                        currentInitializer.declarations
                    )
                )
            });
            initializer = context.factory.createVariableDeclarationList(
                [
                    variableDeclarationNode
                ],
                ts.NodeFlags.Let
            );
        } else {
            initializer = context.factory.updateVariableDeclarationList(
                initializer,
                [
                    ...initializer.declarations,
                    variableDeclarationNode
                ],
            );

            // const declarationNode = variableStatement([
            //     [blockScopeIdentifiers, createObject([])]
            // ], initializer.flags);
        }
        // return context.factory.updateVariableDeclarationList(
        //     initializer,
        //     variableDeclarationsList,
        // );
    } else {
        initializer = context.factory.createVariableDeclarationList([
            variableDeclarationNode
        ]);
    }
    const stateNode = nodeToken([
        blockScopeIdentifiers,
        createObject([])
    ], ts.SyntaxKind.EqualsToken);
    if (condition) {
        condition = nodeToken([stateNode, condition], ts.SyntaxKind.CommaToken)
    } else {
        condition = stateNode
    }
    const propertyAccessEqualNodes = defaultDeclarations.map(([propertyName, variableName]) => {
        return nodeToken([
            propertyAccessExpression(
                [blockScopeIdentifiers, propertyName],
                "createPropertyAccessExpression"
            ),
            context.factory.createIdentifier(variableName)
        ], ts.SyntaxKind.EqualsToken);
    });

    if (propertyAccessEqualNodes.length) {
        if (incrementor) {
            incrementor = context.factory.createParenthesizedExpression(
                nodeToken(
                    [
                        ...propertyAccessEqualNodes,
                        incrementor
                    ],
                    ts.SyntaxKind.CommaToken
                )
            )

        } else {
            incrementor = context.factory.createParenthesizedExpression(
                nodeToken(
                    propertyAccessEqualNodes,
                    ts.SyntaxKind.CommaToken
                )
            )
        }

    }


    return {
        initializer: initializer,
        condition: context.factory.createParenthesizedExpression(condition),
        incrementor: incrementor,
    }
}

// const ForBlockVisitor = createBlockVisitor(
//     (statement: ts.Statement, visitor: ts.Visitor, context: CustomContextType, variableState: VariableStateType) => {
//         // let { initializer, statement, incrementor, condition } = node;
//         const visitedStatementNode = visitor(statement) as ts.Statement
//         // const IsInitializerDeclaration = initializer && ts.isVariableDeclarationList(initializer)

//         return {
//             variableState,
//             visitedStatementNode
//         }
//     }
// )
// export const ForStatement =   (node: ts.ForStatement, visitor: ts.Visitor, context: CustomContextType  ) => {
//         // let { initializer, statement, incrementor, condition } = node;
//         let { variableState: blockVariableState, visitedStatementNode: statement } = node.statement && ForBlockVisitor(node.statement, visitor, context);
//         Object.assign(variableState, blockVariableState)
//         let initializer = node.initializer && visitor(node.initializer) as ts.VariableDeclarationList
//         const incrementor = node.incrementor && visitor(node.incrementor) as ts.Expression
//         let condition = node.condition && visitor(node.condition) as ts.Expression
//         // const statement = visitedStatementNode

//         let propertyDeclaration: [ts.Identifier, string, string][] = [];
//         const isInitializerDeclaration = initializer && ts.isVariableDeclarationList(initializer)
//         if (isInitializerDeclaration) {
//             initializer = initializer!
//             for (const variableDeclaration of initializer.declarations) {
//                 const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
//                 for (const declarationIdentifierName in declarationNamesObject) {
//                     // const identifierState = getIdentifierState(declarationIdentifierName, context);
//                     const flags = initializer.flags;
//                     context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
//                         identifierState.declaredFlag = flags;
//                         const { substituteCallback } = identifierState
//                         identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
//                             propertyDeclaration.push([
//                                 declarationIdentifier,
//                                 indexIdToUniqueString,
//                                 declarationIdentifierName
//                             ])
//                             substituteCallback(indexIdToUniqueString, declarationIdentifier);
//                         }
//                     })

//                 }
//             }

//             // }

//             // if (isInitializerDeclaration) {
//             //     initializer = initializer!
//             if (initializer.flags === ts.NodeFlags.None) {
//                 const conditionCache = condition;
//                 condition ||= context.factory.createIdentifier("")
//                 context.substituteNodesList.set(condition, () => {
//                     context.substituteNodesList.delete(condition!)
//                     if (propertyDeclaration.length) {
//                         const conditionsNodes: ts.Expression[] = propertyDeclaration.map(([declarationIdentifier, propertyName, variableName]) => {
//                             return context.factory.createParenthesizedExpression(nodeToken([
//                                 propertyAccessExpression([declarationIdentifier, propertyName], "createPropertyAccessExpression"),
//                                 identifier(variableName)
//                             ]))
//                         });

//                         if (conditionCache) {
//                             conditionsNodes.push(conditionCache)
//                         }
//                         if (conditionsNodes.length === 1) {
//                             return context.factory.createParenthesizedExpression(conditionsNodes[0]);
//                         }

//                         return context.factory.createParenthesizedExpression(nodeToken(conditionsNodes, ts.SyntaxKind.CommaToken));
//                     }
//                     return condition!
//                 })
//             }
//         }




//         if (variableState.blockScopeIdentifiers) {
//             if (initializer?.flags === ts.NodeFlags.Let) {
//                 initializer = context.factory.updateVariableDeclarationList(
//                     initializer,
//                     [
//                         ...initializer.declarations,
//                         context.factory.createVariableDeclaration(
//                             variableState.blockScopeIdentifiers,
//                             undefined,
//                             undefined,
//                             undefined,
//                         )
//                     ]
//                 );
//                 const conditionCache = condition;
//                 condition = context.factory.createParenthesizedExpression(nodeToken([
//                     variableState.blockScopeIdentifiers,
//                     createObject(propertyDeclaration.map(el => [identifier(el[1]), identifier(el[2])]))
//                 ]))
//                 if (conditionCache) {
//                     condition = context.factory.createParenthesizedExpression(nodeToken([
//                         condition,
//                         conditionCache
//                     ], ts.SyntaxKind.CommaToken))
//                 }
//             } else {
//                 if (ts.isBlock(statement)) {
//                     statement = context.factory.updateBlock(
//                         statement,
//                         [
//                             variableStatement([
//                                 [
//                                     variableState.blockScopeIdentifiers,
//                                     createObject([])
//                                 ]
//                             ]),
//                             ...statement.statements
//                         ]
//                     )
//                 } else {
//                     statement = context.factory.createBlock([
//                         variableStatement([
//                             [
//                                 variableState.blockScopeIdentifiers,
//                                 createObject([])
//                             ]
//                         ]),
//                         statement
//                     ])
//                 }
//             }

//         }

//         return context.factory.updateForStatement(
//             node,
//             initializer,
//             condition,
//             incrementor,
//             statement
//         )
//     }
// )