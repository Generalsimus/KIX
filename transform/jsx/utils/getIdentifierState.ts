import { DeclarationIdentifiersStateType, declarationTypes, PreCustomContextType } from "..";
import { ArrayElement } from "../../../utility-types";

let JSX_IDENTIFIERS_KEY_INDEX_CACHE = 0;
export const getIdentifierState = (identifierName: string, context: PreCustomContextType) => {
    let identifierState = context.usedIdentifiers.get(identifierName);
    let isJsx = false;
    let isChanged = false;
    let declaration: DeclarationIdentifiersStateType["declaration"] | undefined;
    // let substituteIdentifiers: DeclarationIdentifiersStateType["substituteIdentifiers"] = new Map();

    if (!identifierState) {
        context.usedIdentifiers.set(identifierName, (identifierState = {
            indexId: ++JSX_IDENTIFIERS_KEY_INDEX_CACHE,
            name: identifierName,
            // isJsx: false,
            get isJsx() {
                return isJsx;
            },
            set isJsx(newValue: boolean) {
                if (isJsx != newValue) {
                    isJsx = newValue;

                }
                // addInBlockTransformer(this, context);
            },
            // isChanged: false,
            get isChanged() {
                return isChanged;
            },
            set isChanged(newValue: boolean) {
                isChanged = newValue;
                // addInBlockTransformer(this, context);
            },
            substituteIdentifiers: new Map(),
            // get substituteIdentifiers() {
            //     if (this.isJsx && this.isChanged && this.declaration) {
            //         // console.log("🚀 --> (this.isJsx && this.isChanged && this.declaration)", this.name, !!(this.isJsx && this.isChanged && this.declaration));
            //         addInBlockTransformerIfNeeded(this, context);
            //         if (substituteIdentifiers.size) {
            //             substituteIdentifiers.forEach((value, key) => context.substituteNodesList.set(key, value));
            //         }
            //         return context.substituteNodesList
            //     } else {
            //         return substituteIdentifiers
            //     }
            // },
            get declaration() {
                return declaration;
            },
            set declaration(newValue: typeof declaration) {
                declaration = newValue;

                addInBlockTransformerIfNeeded(this, context);
            },
        }));
    }

    return identifierState;
}

export const addInBlockTransformerIfNeeded = (identifierState: DeclarationIdentifiersStateType, context: PreCustomContextType) => {
    if (identifierState.isJsx && identifierState.isChanged && identifierState.declaration) {
        const { replaceBlockNodes } = context
        let replaceBlockNode = replaceBlockNodes.get(identifierState.declaration.node);
        if (!replaceBlockNode) {
            replaceBlockNodes.set(identifierState.declaration.node, (replaceBlockNode = {}))
        }
        // new Map()
        identifierState.declaration.getBlockVariableStateUniqueIdentifier();
        (replaceBlockNode[identifierState.name] || (replaceBlockNode[identifierState.name] = new Set())).add(identifierState)
        // let identifierNameDeclarationMap = replaceBlockNode[1].get(identifierState.name);
        // if (!identifierNameDeclarationMap) {
        // replaceBlockNode.set(identifierState.name, (identifierNameDeclarationMap = new Map()));

        // }
        // identifierNameDeclarationMap.set(identifierState.name, identifierState.declaration);
    }
}