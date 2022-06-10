import ts from "typescript";
import { DeclarationIdentifiersStateType, PreCustomContextType } from "../../..";
 

export const rewriteSubstituteNodes = (identifierState: DeclarationIdentifiersStateType, context: PreCustomContextType) => {
    identifierState.substituteIdentifiers.forEach((value, key) => {
        context.enableSubstitution(key.kind);

        context.substituteNodesList.set(key, value);
    });
}