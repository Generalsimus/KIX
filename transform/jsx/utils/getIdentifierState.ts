import ts from "typescript";
import { CustomContextType, declaredBlockIdentifiersType, IdentifiersStateType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getIndexId } from "./getIndexId";

// export const getIdentifierState = (identifierName: string, context: CustomContextType): IdentifiersStateType => {
//     let identifierState = context.usedIdentifiers.get(identifierName)


//     if (!identifierState) {
//         let substituteCallback: IdentifiersStateType["substituteCallback"] = () => { }
//         const { getVariableUniqueIdentifier } = context
//         const indexId = getIndexId()
//         identifierState = {
//             isJsx: false,
//             isChanged: false,
//             declaredFlag: undefined,
//             get substituteCallback() {
//                 return substituteCallback
//             },
//             set substituteCallback(newValue) {
//                 if (this.isJsx && this.isChanged && this.declaredFlag !== undefined) {
//                     if (this.declaredFlag !== ts.NodeFlags.Const) {
//                         newValue(NumberToUniqueString(indexId), getVariableUniqueIdentifier(this.declaredFlag));
//                     }
//                     substituteCallback = () => { }
//                 } else {
//                     substituteCallback = newValue
//                 }
//             }

//         }
//         context.usedIdentifiers.set(identifierName, identifierState);
//     }

//     return identifierState;
// }




// export const catchIdentifierState = (
//     identifierName: string,
//     context: CustomContextType,
//     callback: (identifierState: IdentifiersStateType) => void
// ) => {
//     let prevGetIdentifierStateCallback = context.usedIdentifiers2.get(identifierName)

//     context.usedIdentifiers2.set(identifierName, (blockId) => {
//         // usedIdentifiers2+
//         blockId
//     })
// }

const createIdentifiersMap = (context: CustomContextType) => {
    const declaredBlockIdentifiers = new Map<string, IdentifiersStateType>();
    const addDeclaredIdentifierState = (identifierName: string) => {
        if (!declaredBlockIdentifiers.has(identifierName)) {
            let substituteCallback: IdentifiersStateType["substituteCallback"] = () => { }
            const { getVariableUniqueIdentifier } = context
            const indexId = getIndexId();
            declaredBlockIdentifiers.set(identifierName, {
                isJsx: false,
                isChanged: false,
                declaredFlag: undefined,
                get substituteCallback() {
                    return substituteCallback
                },
                set substituteCallback(newValue) {
                    // console.log("🚀 --> file: --> this",
                    //     !!this.isJsx, !!this.isChanged, this.declaredFlag !== undefined
                    // );
                    if (this.isJsx && this.isChanged && this.declaredFlag !== undefined) {
                        if (this.declaredFlag !== ts.NodeFlags.Const) {
                            newValue(NumberToUniqueString(indexId), getVariableUniqueIdentifier(this.declaredFlag));
                        }
                        substituteCallback = () => { }
                    } else {
                        substituteCallback = newValue
                    }
                }

            })
        }
    }
    return { declaredBlockIdentifiers, addDeclaredIdentifierState }
}
// declaredBlockIdentifiers: blockDeclaredIdentifiersType


export const creteManageIdentifierState = <R extends any>(context: CustomContextType, isGlobalBlock: boolean, visitor: () => R): R => {
    const { declaredBlockIdentifiers, addDeclaredIdentifierState } = createIdentifiersMap(context);

    let previousIdentifiersChannelCallback = context.identifiersChannelCallback
    context.identifiersChannelCallback = () => { }


    const addIdentifiersChannelCallback = (identifierName: string, addCallback: (identifierState: IdentifiersStateType) => void) => {


        const newIdentifiersChannelCallback = (declaredBlockIdentifiers: declaredBlockIdentifiersType, isGlobalBlock: boolean) => {
            const identifierState = declaredBlockIdentifiers.get(identifierName);

            if (identifierState) {
                addCallback(identifierState)
            } else {
                const previousIdentifiersChannelCallbackCache = previousIdentifiersChannelCallback
                previousIdentifiersChannelCallback = (declaredBlockIdentifiers, isGlobalBlock) => {
                    previousIdentifiersChannelCallbackCache(declaredBlockIdentifiers, isGlobalBlock);
                    newIdentifiersChannelCallback(declaredBlockIdentifiers, isGlobalBlock);
                }
            }
        }

        const identifiersChannelCallbackCache = context.identifiersChannelCallback
        context.identifiersChannelCallback = (declaredBlockIdentifiers, isGlobalBlock) => {
            newIdentifiersChannelCallback(declaredBlockIdentifiers, isGlobalBlock);
            identifiersChannelCallbackCache(declaredBlockIdentifiers, isGlobalBlock);
        }
    }







    const addDeclaredIdentifierCache = context.addDeclaredIdentifierState
    context.addDeclaredIdentifierState = addDeclaredIdentifierState
    const addIdentifiersChannelCallbackCache = context.addIdentifiersChannelCallback
    context.addIdentifiersChannelCallback = addIdentifiersChannelCallback


    const res = visitor();

    context.identifiersChannelCallback(declaredBlockIdentifiers, isGlobalBlock);
    context.identifiersChannelCallback = previousIdentifiersChannelCallback
    context.addDeclaredIdentifierState = addDeclaredIdentifierCache
    context.addIdentifiersChannelCallback = addIdentifiersChannelCallbackCache



    return res
}