import ts from "typescript";
import { CustomContextType, IdentifiersStateType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";

let JSX_IDENTIFIERS_KEY_INDEX_CACHE = 0;
export const getIdentifierState = (identifierName: string, context: CustomContextType): IdentifiersStateType => {
    let identifierState = context.usedIdentifiers.get(identifierName);
    let isJsx = false;
    let isChanged = false;
    let isDeclared: IdentifiersStateType["isDeclared"]
    let substituteIdentifiers: IdentifiersStateType["substituteIdentifiers"] = new Map();

    if (!identifierState) {
        context.usedIdentifiers.set(identifierName, (identifierState = {
            indexId: ++JSX_IDENTIFIERS_KEY_INDEX_CACHE,
            isJsx: false,
            isChanged: false,
            isDeclared: false,
            get substituteIdentifiers() {
                if (isJsx && isChanged && isDeclared) {
                    if (substituteIdentifiers.size) {
                        substituteIdentifiers.forEach((value, key) => {
                            context.substituteNodesList.set(key, value);
                        });
                    }
                    return context.substituteNodesList
                }
                return substituteIdentifiers
            },

        }));
    }

    return identifierState;
}




// export const updateSubstituteIdentifiers = (
//     substituteIdentifiers: IdentifiersStateType["substituteIdentifiers"],
//     context: CustomContextType
// ) => {

//     substituteIdentifiers.forEach((value, key) => {
//         context.substituteNodesList.set(key, value);
//     });

// }