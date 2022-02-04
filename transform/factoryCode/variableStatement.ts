
import ts from "typescript";

const factory = ts.factory;
export const variableStatement = (Nodes: [ts.BindingName | string, ts.Expression][], flag = ts.NodeFlags.Const) => {
    return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
            Nodes.map(([NameNode, ValueNode]) => {
                return factory.createVariableDeclaration(
                    NameNode,
                    undefined,
                    undefined,
                    ValueNode
                );
            }),
            flag
        )
    );
}