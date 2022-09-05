import ts from "typescript"


export const filterNodeModifiers = <M extends (ts.ModifierLike | ts.Modifier)>(modifiers: readonly M[] | undefined, modifierKind = ts.SyntaxKind.ExportKeyword): any => {

    const newModifiers: M[] = []
    let isFiltered = false
    for (const modifier of (modifiers || [])) {
        if (modifier.kind === modifierKind) {
            isFiltered ||= true
        } else {
            newModifiers.push(modifier)
        }
    }
    return [
        isFiltered,
        ts.factory.createNodeArray(newModifiers)
    ]
}