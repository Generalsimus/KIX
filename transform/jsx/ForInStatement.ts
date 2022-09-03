import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { newBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";

// type DefaultDeclarationsType = [string, string][]
const ForInStatementVisitor = newBlockVisitor(<N extends ts.ForInStatement>({ initializer, statement }: N, visitor: ts.Visitor, context: CustomContextType) => {
    const defaultDeclarations: createObjectArgsType = [];

    if (ts.isVariableDeclarationList(initializer)) {
        for (const variableDeclaration of initializer.declarations) {
            const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
            for (const declarationIdentifierName in declarationNamesObject) {
                context.addDeclaredIdentifierState(declarationIdentifierName);
                context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                    context.addDeclaredIdentifierState(declarationIdentifierName);
                    context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                        identifierState.declaredFlag = initializer.flags;
                        const { substituteCallback } = identifierState
                        identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                            if (initializer.flags !== ts.NodeFlags.None) {
                                defaultDeclarations.push([
                                    indexIdToUniqueString,
                                    context.factory.createIdentifier(declarationIdentifierName)
                                ]);
                            }
                            substituteCallback(indexIdToUniqueString, declarationIdentifier)
                        }
                    })
                })
            }
        }
    }
    return {
        defaultDeclarations: defaultDeclarations,
        statement: visitor(statement) as typeof statement
    }
}, false);

export const ForInStatement = (
    node: ts.ForInStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const [{ statement, defaultDeclarations }, variableState] = ForInStatementVisitor(node, visitor, context);
    const updatedStatement = updateForInStatementStatement(
        statement,
        variableState,
        defaultDeclarations,
        context
    );
    return context.factory.updateForInStatement(
        node,
        visitor(node.initializer) as typeof node.initializer,
        visitor(node.expression) as typeof node.expression,
        updatedStatement,
    )
}
const updateForInStatementStatement = (
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