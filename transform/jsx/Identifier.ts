import ts, { } from "typescript";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { callFunction } from "../factoryCode/callFunction";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { getIdentifierState } from "./utils/getIdentifierState";
// import { updateSubstitutions } from "../utils/updateSubstitutions";


export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: CustomContextType) => {


  if (context.getJSXPropRegistrationIdentifier && context.isSubstitutionEnabled(node)) {
    const JSXPropRegistrationIdentifier = context.getJSXPropRegistrationIdentifier();

    const identifierName = ts.idText(node);
    const identifierState = getIdentifierState(identifierName, context);
    // const changeableIdentifierState = isChangeableIdentifierState(identifierState);
    // const substitutionsMap = changeableIdentifierState ? context.substituteNodesList : identifierState.substituteIdentifiers;
    // : CustomContextType['substituteNodesList'] | DeclarationIdentifiersStateType["substituteIdentifiers"] 

    identifierState.isJsx = true;
    const { getBlockVariableStateUniqueIdentifier } = context
    identifierState.substituteIdentifiers.set(node, () => {
      return callFunction(
        JSXPropRegistrationIdentifier,
        [
          getBlockVariableStateUniqueIdentifier(),
          stringLiteral(getKeyAccessIdentifierName(identifierState.indexId, identifierName))
        ]
      )
    });

  }

  return node
}





export const getKeyAccessIdentifierName = (identifierKeyNumber: number, identifierName: string) => {

  return `${NumberToUniqueString(identifierKeyNumber)}`
  // return `${NumberToUniqueString(identifierKeyNumber)}_${identifierName}`
}