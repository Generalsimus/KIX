import ts from "typescript";


export const getVariableDeclarationNames = (node: ts.BindingElement, currentThree: string[] = [], three: Record<string, string[]> = {}) => {
    const currentThreeList = [...currentThree]
    const identifierName = (node.propertyName || node.name)
    if (ts.isIdentifier(identifierName)) {
        currentThreeList.push(identifierName.getText());

        if (ts.isIdentifier(node.name)) {
            three[node.name.getText()] = currentThreeList
        }

    }

    if (node && ts.isObjectBindingPattern(node.name)) {

        for (const element of node.name.elements) {
            getVariableDeclarationNames(element, [...currentThreeList], three)
        }

    }
    return three
} 