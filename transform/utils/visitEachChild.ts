import ts from "typescript";

export const visitEachChildPolyfill = (preNode: ts.Node, callback: <T extends ts.Node>(node: T) => T) => {
    const cloneNode = { ...preNode }
    console.log("🚀 --> file: --> node", ts.SyntaxKind[(preNode as any).kind]);
    for (const key in preNode) {
        const node: ts.Node | ts.NodeArray<ts.Node> = (preNode as any)[key];

        if (node instanceof Array) {
            const newNodes: ts.Node[] = (cloneNode as any)[key] = []
            for (const elementNode of node) {
                const visited = visitEachChildPolyfill(elementNode, callback)
                if (visited) {
                    newNodes.push(visited as any);
                }
            }
        } else if (node instanceof Object) {
            const visited = visitEachChildPolyfill(node, callback);
            if (visited) {
                (cloneNode as any)[key] = visited
            }
        }

    }
    return cloneNode
}