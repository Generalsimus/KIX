import ts, { GeneratedIdentifierFlags, textSpanContainsTextSpan } from "typescript";
import { CustomContextType } from "../..";
import { NumberToUniqueString } from "../../../utils/numberToUniqueString";
import { callFunction } from "../../factoryCode/callFunction";
import { stringLiteral } from "../../factoryCode/stringLiteral";
import { getVariableWithIdentifierKey } from "../utils/getVariableWithIdentifierKey";
import { updateSubstitutions } from "../utils/updateSubstitutions";


export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: CustomContextType) => {


  if (context.getJSXPropRegistrationIdentifier && context.isSubstitutionEnabled(node)) {
    const identifierName = ts.idText(node);
    const identifiersState = getVariableWithIdentifierKey(identifierName, context);


    identifiersState.isJsxIdentifier = true;
    const JSXPropRegistrationIdentifier = context.getJSXPropRegistrationIdentifier();

    identifiersState.substituteIdentifiers.set(node, () => {

      return identifiersState.valueChanged ? callFunction(
        JSXPropRegistrationIdentifier,
        [
          context.getVariableDeclarationStateNameIdentifier(),
          stringLiteral(getKeyAccessIdentifierName(identifiersState.identifiersIndex, identifierName))
        ]
      ) : node
    });

    // updateSubstitutions(identifierName, identifiersState, context);
  }

  return node
}





// const getJsxEqualInitializer = (identifierKey: string) => {

// } 
export const getKeyAccessIdentifierName = (identifierKeyNumber: number, identifierName: string) => {

  return `${NumberToUniqueString(identifierKeyNumber)}`
  // return `${NumberToUniqueString(identifierKeyNumber)}_${identifierName}`
} 