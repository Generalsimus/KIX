import ts from "typescript";


export const getVariableDeclarationNames = (node: ts.BindingElement, currentThree: string[] = [], three: string[][] = []) => {
    const currentThreeList = [...currentThree]
    const identifierName = (node.propertyName || node.name)
    if (ts.isIdentifier(identifierName)) {
        currentThreeList.push(identifierName.getText());
        // escapedText
        // Object.defineProperty(identifierName.escapedText, "getRealName", {
        //     get: () => node.name?.escapedText
        // })
        if (ts.isIdentifier(node.name)) {
            three.push(currentThreeList)
        }

    }
    // ts.ObjectBindingPattern
    if (node && ts.isObjectBindingPattern(node.name)) {

        for (const element of node.name.elements) {
            getVariableDeclarationNames(element, [...currentThreeList], three)
        }

    }
    return three
} 