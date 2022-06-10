import ts, { } from "typescript";
import { PreCustomContextType } from ".";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { callFunction } from "../factoryCode/callFunction";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { addInBlockTransformerIfNeeded, getIdentifierState } from "./utils/getIdentifierState";
// import { updateSubstitutions } from "../utils/updateSubstitutions";


export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: PreCustomContextType) => {


  if (context.getJSXPropRegistrationIdentifier && context.isSubstitutionEnabled(node)) {
    const JSXPropRegistrationIdentifier = context.getJSXPropRegistrationIdentifier();

    const identifierName = ts.idText(node);
    const identifierState = getIdentifierState(identifierName, context);
    // const changeableIdentifierState = isChangeableIdentifierState(identifierState);
    // const substitutionsMap = changeableIdentifierState ? context.substituteNodesList : identifierState.substituteIdentifiers;
    // : PreCustomContextType['substituteNodesList'] | DeclarationIdentifiersStateType["substituteIdentifiers"] 
    identifierState.isJsx = true;
    identifierState.substituteIdentifiers.set(node, () => {
      return callFunction(
        JSXPropRegistrationIdentifier,
        [
          identifierState.declaration!.getBlockVariableStateUniqueIdentifier(),
          stringLiteral(getKeyAccessIdentifierName(identifierState.indexId, identifierName))
        ]
      )
    });
    // addInBlockTransformerIfNeeded(identifierState, context);

  }

  return node
}





export const getKeyAccessIdentifierName = (identifierKeyNumber: number, identifierName: string) => {

  return `${NumberToUniqueString(identifierKeyNumber)}`
  // return `${NumberToUniqueString(identifierKeyNumber)}_${identifierName}`
}