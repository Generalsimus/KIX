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
    const addDeclaredIdentifierState = (identifierName: string, identifierState?: IdentifiersStateType) => {
        const hasIdentifierState = declaredBlockIdentifiers.has(identifierName)
        if (identifierState) {
            if (hasIdentifierState) {
                const oldIdentifierState = declaredBlockIdentifiers.get(identifierName)!
                identifierState.isJsx ||= oldIdentifierState.isJsx
                identifierState.isChanged ||= oldIdentifierState.isChanged
                const { substituteCallback } = identifierState
                const { substituteCallback: oldSubstituteCallback } = oldIdentifierState
                identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                    substituteCallback(indexIdToUniqueString, declarationIdentifier);
                    oldSubstituteCallback(indexIdToUniqueString, declarationIdentifier);
                }
            }
            return declaredBlockIdentifiers.set(identifierName, identifierState)
        } else if (!hasIdentifierState) {

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


type LocalIdentifiersChannelCallbackType = (declaredBlockIdentifiers: declaredBlockIdentifiersType, isGlobalBlock: boolean) => void

export const creteManageIdentifierState = <R extends any>(context: CustomContextType, isGlobalBlock: boolean, visitor: () => R): R => {
    const { declaredBlockIdentifiers, addDeclaredIdentifierState } = createIdentifiersMap(context);
    let localIdentifiersChannelCallback: LocalIdentifiersChannelCallbackType = () => { }

    const addDeclaredIdentifierParentCache = context.addDeclaredIdentifierState
    const addIdentifiersChannelCallbackParentCache = context.addIdentifiersChannelCallback

    const addIdentifiersChannelCallback = (
        identifierName: string,
        addCallback: (identifierState: IdentifiersStateType) => void
    ) => {

        const newIdentifiersChannelCallback = (declaredBlockIdentifiers: declaredBlockIdentifiersType, isGlobalBlock: boolean) => {
            const identifierState = declaredBlockIdentifiers.get(identifierName);
            if (identifierState) {
                if (identifierState.declaredFlag === ts.NodeFlags.None && !isGlobalBlock) {
                    addIdentifiersChannelCallbackParentCache(identifierName, addCallback);
                    addDeclaredIdentifierParentCache(identifierName, identifierState);
                } else {
                    addCallback(identifierState)
                }
            } else {
                addIdentifiersChannelCallbackParentCache(identifierName, addCallback);
            }
        }



        const localIdentifiersChannelCallbackCache = localIdentifiersChannelCallback
        localIdentifiersChannelCallback = (declaredBlockIdentifiers: declaredBlockIdentifiersType, isGlobalBlock: boolean) => {
            localIdentifiersChannelCallbackCache(declaredBlockIdentifiers, isGlobalBlock);
            newIdentifiersChannelCallback(declaredBlockIdentifiers, isGlobalBlock);
        }
    }







    context.addDeclaredIdentifierState = addDeclaredIdentifierState
    context.addIdentifiersChannelCallback = addIdentifiersChannelCallback


    const visitedBlock = visitor();
    localIdentifiersChannelCallback(declaredBlockIdentifiers, isGlobalBlock);


    context.addDeclaredIdentifierState = addDeclaredIdentifierParentCache
    context.addIdentifiersChannelCallback = addIdentifiersChannelCallbackParentCache



    return visitedBlock
}