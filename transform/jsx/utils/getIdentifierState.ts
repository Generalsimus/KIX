import ts from "typescript";
import { CustomContextType, IdentifiersStateType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getIndexId } from "./getIndexId";

export const getIdentifierState = (identifierName: string, context: CustomContextType): IdentifiersStateType => {
    let identifierState = context.usedIdentifiers.get(identifierName);


    if (!identifierState) {
        let substituteCallback: IdentifiersStateType["substituteCallback"] = () => { }
        const { getVariableUniqueIdentifier } = context
        context.usedIdentifiers.set(identifierName, (identifierState = {
            isJsx: false,
            isChanged: false,
            declaredFlag: undefined,
            get substituteCallback() {
                return substituteCallback
            },
            set substituteCallback(newValue) {
                if (this.isJsx && this.isChanged && this.declaredFlag !== undefined) {
                    newValue(NumberToUniqueString(getIndexId()), getVariableUniqueIdentifier(this.declaredFlag));
                    substituteCallback = () => { }
                } else {
                    substituteCallback = newValue
                }
            }

        }));
    }

    return identifierState;
}



