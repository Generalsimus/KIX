import ts from "typescript"

export const filterNodeModifiers = (node: Pick<ts.Node, "modifiers">, modifierKind = ts.SyntaxKind.ExportKeyword): [
    boolean,
    ts.NodeArray<ts.Modifier>
] => {
    const modifiers: ts.Modifier[] = []
    let isFiltered = false
    for (const modifier of (node.modifiers || [])) {
        if (modifier.kind === modifierKind) {
            isFiltered ||= true
        } else {
            modifiers.push(modifier)
        }
    }
    return [
        isFiltered,
        ts.factory.createNodeArray(modifiers)
    ]
}