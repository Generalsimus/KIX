import ts from "typescript";
import { CustomContextType } from "..";
import { createObject } from "../factoryCode/createObject";
import { variableStatement } from "../factoryCode/variableStatement";
import { VariableStateType } from "./utils/createBlockVisitor";
import { createGlobalBlockNodesVisitor } from "./utils/createGlobalBlockNodesVisitor";

export const ClassStaticBlockDeclaration = createGlobalBlockNodesVisitor(
    (visitedNode: ts.ClassStaticBlockDeclaration, declarationVariableNode, context) => {

        return context.factory.updateClassStaticBlockDeclaration(
            visitedNode,
            context.factory.updateBlock(
                visitedNode.body,
                [
                    declarationVariableNode,
                    ...visitedNode.body.statements
                ]
            ),
        )
        // return context.factory.updateArrowFunction(
        //     visitedNode,
        //     visitedNode.modifiers,
        //     visitedNode.typeParameters,
        //     visitedNode.parameters,
        //     visitedNode.type,
        //     visitedNode.equalsGreaterThanToken,
        //     ConciseBodyToMultiLineBlock(visitedNode.body, context, [
        //         declarationVariableNode,
        //     ]),
        // )
    }
)

// export const ClassStaticBlockDeclaration = () => createBlockVisitor((
//     node: ts.ClassStaticBlockDeclaration,
//     visitor: ts.Visitor,
//     context: CustomContextType,
//     variableState: VariableStateType
// ) => {
//     const visitedNode = ts.visitEachChild(node, visitor, context)
//     if (variableState.blockScopeIdentifiers) {
//         return context.factory.updateClassStaticBlockDeclaration(
//             visitedNode,
//             visitedNode.decorators,
//             visitedNode.modifiers,
//             context.factory.updateBlock(
//                 visitedNode.body,
//                 [
//                     variableStatement([
//                         [variableState.blockScopeIdentifiers, createObject([])]
//                     ]),
//                     ...visitedNode.body.statements
//                 ]
//             ),
//         )
//     }
//     return visitedNode
// })