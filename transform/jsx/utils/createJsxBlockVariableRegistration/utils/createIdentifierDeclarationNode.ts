import { DeclarationIdentifiersStateType, PreCustomContextType } from "../../..";
import { NumberToUniqueString } from "../../../../../utils/numberToUniqueString";
import { identifier } from "../../../../factoryCode/identifier";
import { nodeToken } from "../../../../factoryCode/nodeToken";
import { propertyAccessExpression } from "../../../../factoryCode/propertyAccessExpression";
import { rewriteSubstituteNodes } from "./rewriteSubstituteNodes";

export const createIdentifierDeclarationNode = (identifierState: DeclarationIdentifiersStateType, context: PreCustomContextType) => {

    context.usedIdentifiers.delete(identifierState.name);

    rewriteSubstituteNodes(identifierState, context);

    return nodeToken([
        propertyAccessExpression(
            [
                identifierState.declaration!.getBlockVariableStateUniqueIdentifier(),
                NumberToUniqueString(identifierState.indexId)
            ],
            "createPropertyAccessExpression"
        ),
        identifier(identifierState.name)
    ])

}