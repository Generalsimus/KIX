import ts from "typescript";


export const getVariableDeclarationNames = (node: ts.BindingElement | ts.VariableDeclaration, currentThree: string[] = [], three: Record<string, string[]> = {}) => {
    const currentThreeList = [...currentThree]
    const identifierName = ((node as any).propertyName || node.name)
    if (ts.isIdentifier(identifierName)) {
        currentThreeList.push(ts.idText(identifierName));

        if (ts.isIdentifier(node.name)) {
            three[ts.idText(node.name)] = currentThreeList
        }

    }

    if (node && ts.isObjectBindingPattern(node.name)) {

        for (const element of node.name.elements) {
            getVariableDeclarationNames(element, [...currentThreeList], three)
        }

    }
    return three
} 