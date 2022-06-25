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
    

    identifierState.isJsx = true; 
    const { substituteCallback } = identifierState
    identifierState.substituteCallback = (indexIdToUniqueString, declarationIdentifier ) => {

      context.substituteNodesList.set(node, () => {
        return callFunction(
          JSXPropRegistrationIdentifier,
          [
            declarationIdentifier,
            stringLiteral(indexIdToUniqueString)
          ]
        )
      });
      substituteCallback(indexIdToUniqueString, declarationIdentifier)
    }

  }

  return node
}



 