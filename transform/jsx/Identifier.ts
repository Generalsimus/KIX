import ts, { GeneratedIdentifierFlags, textSpanContainsTextSpan } from "typescript";
import { PreCustomContextType } from ".";
import { CustomContextType } from "..";
import { NumberToUniqueString } from "../../utils/numberToUniqueString";
import { callFunction } from "../factoryCode/callFunction";
import { stringLiteral } from "../factoryCode/stringLiteral";
import { getVariableWithIdentifierKey } from "./utils/getVariableWithIdentifierKey";
import { getBlockNodeData } from "./utils/getVariableWithIdentifierState/utils/getBlockNodeData";
// import { updateSubstitutions } from "../utils/updateSubstitutions";


export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: PreCustomContextType) => {


  if (context.getJSXPropRegistrationIdentifier && context.isSubstitutionEnabled(node)) {
    const identifierName = ts.idText(node);
    const identifierState = getIdentifierState(identifierName, context);
    identifierState.isJsx = true;
    identifierState.substituteIdentifiers.set(node, () => {
      return node
    })

  }

  return node
}

const getIdentifierState = (identifierName: string, context: PreCustomContextType) => {
  let identifiersState = context.usedIdentifiers.get(identifierName);

  if (!identifiersState) {
    context.usedIdentifiers.set(identifierName, (identifiersState = {
      indexId: 0,
      isJsx: false,
      isChanged: false,
      substituteIdentifiers: new Map(),
      declaration: undefined
    }));
  }

  return identifiersState;
}


// const getJsxEqualInitializer = (identifierKey: string) => {

// } 
export const getKeyAccessIdentifierName = (identifierKeyNumber: number, identifierName: string) => {

  return `${NumberToUniqueString(identifierKeyNumber)}`
  // return `${NumberToUniqueString(identifierKeyNumber)}_${identifierName}`
} 