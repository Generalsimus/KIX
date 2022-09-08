import ts from "typescript";
import { CustomContextType } from "..";
import { createObject, createObjectArgsType } from "../factoryCode/createObject";
import { identifier } from "../factoryCode/identifier";
import { nodeToken } from "../factoryCode/nodeToken";
import { propertyAccessExpression } from "../factoryCode/propertyAccessExpression";
import { variableStatement } from "../factoryCode/variableStatement";
import { getVariableDeclarationNames } from "../utils/getVariableDeclarationNames";
import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
import { PropertyAccessExpressionOrElementAccessExpression } from "./utils/PropertyAccessExpressionOrElementAccessExpression";
// import { createBlockVisitor, VariableStateType } from "./utils/createBlockVisitor";
// import { getIdentifierState } from "./utils/getIdentifierState";
// context.getVariableUniqueIdentifier
interface InitializerArgType {
    getVariableUniqueIdentifierParent: CustomContextType["getVariableUniqueIdentifier"],
    // addDeclaredIdentifierStateParent: CustomContextType["addDeclaredIdentifierState"],
    node: ts.ForStatement
}
const ForStatementBlockVisitor = createBlockVisitor(<N extends InitializerArgType>(
    {
        node: { statement, initializer },
        getVariableUniqueIdentifierParent
    }: N,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    const getVariableUniqueIdentifierCache = context.getVariableUniqueIdentifier
    context.getVariableUniqueIdentifier = getVariableUniqueIdentifierParent

    statement = visitor(statement) as typeof statement;

    context.getVariableUniqueIdentifier = getVariableUniqueIdentifierCache

    return statement

}, false);

const ForStatementVisitor = createBlockVisitor((
    node: ts.ForStatement,
    visitor: ts.Visitor,
    context: CustomContextType
) => {
    let { initializer, condition, incrementor } = node
    initializer = initializer && visitor(initializer) as typeof initializer
    condition = condition && visitor(condition) as typeof condition
    incrementor = incrementor && visitor(incrementor) as typeof incrementor
    if (initializer && ts.isVariableDeclarationList(initializer)) {
        for (const variableDeclaration of initializer.declarations) {
            const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
            for (const declarationIdentifierName in declarationNamesObject) {
                context.addDeclaredIdentifierState(declarationIdentifierName)
                context.addIdentifiersChannelCallback(declarationIdentifierName, (identifierState) => {
                    identifierState.declaredFlag = initializer!.flags;
                });
            }
        }
    }
    const [statement, _] = ForStatementBlockVisitor({
        node,
        getVariableUniqueIdentifierParent: context.getVariableUniqueIdentifier
    }, visitor, context);


    return {
        initializer,
        condition,
        incrementor,
        statement
    }
}, false)

export const ForStatement = (node: ts.ForStatement, visitor: ts.Visitor, context: CustomContextType) => {
    let [{
        initializer,
        condition,
        incrementor,
        statement
    }, variableState] = ForStatementVisitor(node, visitor, context);

    if (initializer && ts.isVariableDeclarationList(initializer) && initializer.flags === ts.NodeFlags.Let) {
        const letInitializerUpdated = updateLetInitializerAndConditionForBlock(initializer, condition, variableState, context)
        initializer = letInitializerUpdated.initializer
        condition = letInitializerUpdated.condition
    } else {
        statement = updateStatementNode(statement, variableState, context)
    }
    return context.factory.updateForStatement(
        node,
        initializer,
        condition,
        incrementor,
        statement,
    );
}




////////////////////////////////////////////////////////////////////////////////////////
const updateLetInitializerAndConditionForBlock = (
    initializer: ts.VariableDeclarationList,
    condition: ts.ForStatement["condition"],
    { blockScopeIdentifiers }: VariableStateType,
    context: CustomContextType
) => {
    if (!blockScopeIdentifiers) return { initializer, condition }

    const declarationNode = context.factory.createVariableDeclaration(
        blockScopeIdentifiers,
        undefined,
        undefined,
        undefined
    )
    initializer = context.factory.updateVariableDeclarationList(
        initializer,
        [
            declarationNode,
            ...initializer.declarations
        ],
    );
    const stateObjectNode = nodeToken([
        blockScopeIdentifiers,
        createObject([])
    ], ts.SyntaxKind.EqualsToken);

    if (condition) {
        condition = nodeToken([stateObjectNode, condition], ts.SyntaxKind.CommaToken)
    } else {
        condition = stateObjectNode
    }

    return { initializer, condition }
}

////////////////////////////////////////////////////////////////////////////////////////////
const updateStatementNode = (
    statement: ts.ForStatement["statement"],
    { blockScopeIdentifiers }: VariableStateType,
    context: CustomContextType
) => {
    if (!blockScopeIdentifiers) return statement;
    const variableDeclarationNode = variableStatement([
        [
            blockScopeIdentifiers,
            createObject([])
        ],
    ], ts.NodeFlags.Const);

    if (ts.isBlock(statement)) {
        return context.factory.updateBlock(
            statement,
            [
                variableDeclarationNode,
                ...statement.statements
            ],
        )
    }

    return context.factory.createBlock([
        variableDeclarationNode,
        statement
    ])
}