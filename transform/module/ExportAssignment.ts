import ts from "typescript";
import { CustomContextType } from "..";
import { App } from "../../app"; 
import { elementAccessExpression } from "../factoryCode/elementAccessExpression";
import { nodeToken } from "../factoryCode/nodeToken";
import { variableStatement } from "../factoryCode/variableStatement";
const factory = ts.factory;

export const ExportAssignment = (node: ts.ExportAssignment, visitor: ts.Visitor, context: CustomContextType) => {
    // delete node.parent
    // console.log("🚀 --> file: module.ts --> line 13 --> node", node);
    // console.log(node)
    // const returnValue: ts.Node[] = []
    // const moduleVisitor = (childNode) => {
    //     // console.log("🚀 --> file: ExportAssignment.js --> line 13 --> moduleVisitor --> childNode", childNode.expression);
    //     switch (childNode.kind) {
    //         // windowModuleLocationName
    //         default:
    //             returnValue.push(nodeToken([
    //                 elementAccessExpression(["export", "default"]),
    //                 factory.cloneNode(childNode)
    //             ]))

    //     }
    //     // return ts.visitEachChild(childNode.expression, moduleVisitor, context)
    // }
    // moduleVisitor(node.expression)
    // node.expression
    // returnValue.push()
    // returnValue.push
    // console.log("🚀 --> file: ExportAssignment.js --> line 28 --> ExportAssignment --> node", node);
    return nodeToken([
        elementAccessExpression(["export", "default"]),
        node.expression
    ])
}








