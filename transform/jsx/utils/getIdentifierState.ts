import ts from "typescript";
import { CustomContextType, IdentifiersStateType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";

let JSX_IDENTIFIERS_KEY_INDEX_CACHE = 0;
export const getIdentifierState = (identifierName: string, context: CustomContextType): IdentifiersStateType => {
    let identifierState = context.usedIdentifiers.get(identifierName);


    if (!identifierState) {
        let substituteCallback: IdentifiersStateType["substituteCallback"] = () => { }
        const { getVariableUniqueIdentifier } = context
        const indexId = ++JSX_IDENTIFIERS_KEY_INDEX_CACHE
        context.usedIdentifiers.set(identifierName, (identifierState = {
            isJsx: false,
            isChanged: false,
            declaredFlag: undefined,
            get substituteCallback() {
                return substituteCallback
            },
            set substituteCallback(newValue) {
                if (this.isJsx && this.isChanged && this.declaredFlag !== undefined) {
                    newValue(indexId, getVariableUniqueIdentifier(this.declaredFlag));
                    substituteCallback = () => { }
                } else {
                    substituteCallback = newValue
                }
            }

        }));
    }

    return identifierState;
}



