import ts from "typescript";
import { CustomContextType, declaredBlockIdentifiersType, IdentifiersStateType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { identifier } from "../../factoryCode/identifier";
import { nodeToken } from "../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../factoryCode/propertyAccessExpression";
import { getIndexId } from "./getIndexId";



const createIdentifiersMap = (context: CustomContextType) => {
    const declaredBlockIdentifiers = new Map<string, IdentifiersStateType>();
    const addDeclaredIdentifierState = (identifierName: string, identifierState?: IdentifiersStateType) => {
        const hasIdentifierState = declaredBlockIdentifiers.has(identifierName);


        if (!hasIdentifierState) {

            let substituteCallback: IdentifiersStateType["substituteCallback"] = () => { }
            const { getVariableUniqueIdentifier } = context
            const indexId = getIndexId();
            let newIdentifierState = {
                isJsx: false,
                isChanged: false,
                declaredFlag: undefined,
                get substituteCallback() {
                    return substituteCallback
                },
                set substituteCallback(newValue) {

                    const substituteCallbackCache = substituteCallback
                    substituteCallback = (indexIdToUniqueString, declarationIdentifier) => {
                        newValue(indexIdToUniqueString, declarationIdentifier);
                        substituteCallbackCache(indexIdToUniqueString, declarationIdentifier);
                    }
                    if (this.isJsx && this.isChanged && this.declaredFlag !== undefined) {
                        if (this.declaredFlag !== ts.NodeFlags.Const) {
                            substituteCallback(NumberToUniqueString(indexId), getVariableUniqueIdentifier(this.declaredFlag));
                        }
                        substituteCallback = () => { }
                    }
                }

            };

            if (identifierState) {
                newIdentifierState.substituteCallback = identifierState.substituteCallback
            }

            declaredBlockIdentifiers.set(identifierName, newIdentifierState)
        } else if (identifierState) {
            const currentIdentifierState = declaredBlockIdentifiers.get(identifierName)!

            currentIdentifierState.substituteCallback = identifierState.substituteCallback

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