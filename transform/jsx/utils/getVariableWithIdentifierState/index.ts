import ts from "typescript";
import { CustomContextType, VariableDeclarationStatementItemType } from "../../..";
import { identifier } from "../../../factoryCode/identifier";
import { nodeToken } from "../../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../../factoryCode/propertyAccessExpression";
import { getKeyAccessIdentifierName } from "../../Identifier";
import { updateSubstituteData } from "./updateSubstituteData";

let JSX_IDENTIFIERS_KEY_INDEX_CACHE = 0;

export const getVariableWithIdentifierState = (context: CustomContextType, identifierName: string) => {
    let valueChanged: boolean = false;
    let isJsxIdentifier: boolean = false;
    let variableDeclaration: VariableDeclarationStatementItemType["variableDeclaration"];
    let blockNode: VariableDeclarationStatementItemType["blockNode"];

    const identifiersState: VariableDeclarationStatementItemType = {
        identifiersIndex: ++JSX_IDENTIFIERS_KEY_INDEX_CACHE,
        identifierName,
        set isJsxIdentifier(newValue: boolean) {
            isJsxIdentifier = newValue;
        },
        get isJsxIdentifier() {
            return isJsxIdentifier;
        },
        set valueChanged(newValue: boolean) {

            valueChanged = newValue
        },
        get valueChanged() {
            return valueChanged;
        },
        substituteIdentifiers: new Map(),
        set variableDeclaration(newValue: VariableDeclarationStatementItemType["variableDeclaration"]) {
            variableDeclaration = newValue;
            updateSubstituteData(context, this);
            this.substituteIdentifiers.forEach((substitute, key) => {
                console.log("KIND", ts.SyntaxKind[key.kind]);
                context.substituteNodesList.set(key, substitute);
            });
        },
        get variableDeclaration() {
            return variableDeclaration
        },
        set blockNode(newValue: VariableDeclarationStatementItemType["blockNode"]) {
            blockNode = newValue;
            updateSubstituteData(context, this);
            this.substituteIdentifiers.forEach((substitute, key) => {
                console.log("KIND", ts.SyntaxKind[key.kind]);
                context.substituteNodesList.set(key, substitute);
            });

        },
        get blockNode() {
            return blockNode
        },
        getEqualNode(node: ts.Expression | string) {
            return nodeToken([
                propertyAccessExpression(
                    [
                        context.getVariableDeclarationStateNameIdentifier(),
                        getKeyAccessIdentifierName(this.identifiersIndex, this.identifierName)
                    ],
                    "createPropertyAccessExpression"
                ),
                identifier(node)
            ])
        }
    };
    return identifiersState
}