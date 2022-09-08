import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

const ForInStatementVisitor = createBlockVisitor(<N extends ts.ForOfStatement>({ initializer, statement }: N, visitor: ts.Visitor, context: CustomContextType) => {
    const defaultDeclarations: createObjectArgsType = [];

    if (ts.isVariableDeclarationList(initializer)) {
        for (const variableDeclaration of initializer.declarations) {
            const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
            for (const declarationIdentifierName in declarationNamesObject) {
                context.addDeclaredIdentifierState(declarationIdentifierName);

                context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                    identifierState.declaredFlag = initializer.flags;
                    // const { substituteCallback } = identifierState
                    identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                        if (initializer.flags !== ts.NodeFlags.None) {
                            defaultDeclarations.push([
                                indexIdToUniqueString,
                                context.factory.createIdentifier(declarationIdentifierName)
                            ]);
                        }
                        // substituteCallback(indexIdToUniqueString, declarationIdentifier)
                    }
                })

            }
        }
    }

    return {
        defaultDeclarations: defaultDeclarations,
        statement: visitor(statement) as typeof statement
    }
}, false)
export const ForOfStatement = (
    node: ts.ForOfStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const [{ statement, defaultDeclarations }, variableState] = ForInStatementVisitor(node, visitor, context);
    const updatedStatement = updateForOfStatementStatement(
        statement,
        variableState,
        defaultDeclarations,
        context
    )
    return context.factory.updateForOfStatement(
        node,
        node.awaitModifier && visitor(node.awaitModifier) as typeof node.awaitModifier,
        visitor(node.initializer) as typeof node.initializer,
        visitor(node.expression) as typeof node.expression,
        updatedStatement,
    )
}
const updateForOfStatementStatement = (
    statement: ts.ForInStatement["statement"],
    { blockScopeIdentifiers }: VariableStateType,
    defaultDeclarations: createObjectArgsType,
    context: CustomContextType
) => {
    if (!blockScopeIdentifiers) return statement

    const variableDeclarationNode = variableStatement([
        [
            blockScopeIdentifiers,
            createObject(defaultDeclarations)
        ],
    ], ts.NodeFlags.Const);

    if (ts.isBlock(statement)) {
        return context.factory.updateBlock(
            statement,
            [
                variableDeclarationNode,
                ...statement.statements
            ]
        )
    }

    return context.factory.createBlock([
        variableDeclarationNode,
        statement
    ]);
} 