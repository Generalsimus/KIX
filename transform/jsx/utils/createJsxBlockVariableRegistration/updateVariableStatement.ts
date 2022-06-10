import ts from "typescript";
import { replaceBlockNodesValueType, DeclarationIdentifiersStateType, PreCustomContextType } from "../..";
import { getVariableDeclarationNames } from "../../../utils/getVariableDeclarationNames";
import { createIdentifierDeclarationNode } from "./utils/createIdentifierDeclarationNode";

export const updateVariableStatement = (node: ts.VariableStatement, replaceNodeData: replaceBlockNodesValueType, context: PreCustomContextType) => {
    // ValueOf
    // const declarations = [...node.declarationList.declarations];
    // : (ts.VariableDeclaration | ts.ExpressionStatement)[]
    // const statesWithIdentifiersNameKey: Map<string, DeclarationIdentifiersStateType> = new Map();
    // try {

    //     console.warn(ts.getOriginalNode(node).getText());
    // } catch (e) { }


    // replaceNodeData.forEach((identifierState) => {
    // statesWithIdentifiersNameKey.set(identifierState.name, identifierState);
    // const declarationIndex = declarations.indexOf(identifierState.declaration?.declaration!);
    // if (declarationIndex !== -1) {
    //     const identifierDeclarationNode = createIdentifierDeclarationNode(identifierState, context);
    //     declarations.splice(
    //         declarationIndex + 1,
    //         (declarationIndex + 1) * -1,
    //         context.factory.createExpressionStatement(identifierDeclarationNode)
    //     );
    // }

    // })


    return node.declarationList.declarations.flatMap((variableDeclaration) => {
        const declarationNamesObject = getVariableDeclarationNames(variableDeclaration);
        const returnNodes: ts.Node[] = [
            context.factory.updateVariableStatement(
                node,
                node.modifiers,
                context.factory.updateVariableDeclarationList(node.declarationList, [variableDeclaration])
            )
        ]

        for (const declarationIdentifierName in declarationNamesObject) {
            const identifierStates = replaceNodeData[declarationIdentifierName];
            if (identifierStates) {
                identifierStates.forEach(identifierState => {
                    const identifierDeclarationNode = createIdentifierDeclarationNode(identifierState, context);
                    returnNodes.push(context.factory.createExpressionStatement(identifierDeclarationNode));

                });

            }

        }


        return returnNodes
    })
}