import ts, { GeneratedIdentifierFlags } from "typescript";
import { CustomContextType } from "..";

export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: CustomContextType) => {

  // return context.factory.getGeneratedNameForNode(node, GeneratedIdentifierFlags.AllowNameSubstitution);
  // if(ts.isLocalName(node)){

  // // }
  // console.log(ts.SyntaxKind[node.parent?.kind]);
  // if (node.parent && context.isSubstitutionEnabled(node)) {

  //   console.log(ts.idText(node));
  // }
  if (context.getJSXPropRegistrationIdentifier) {

    //     // console.log("🚀 --> file: Identifier.ts --> line 7 --> Identifier --> context", context);
    // return context.factory.getGeneratedNameForNode(node, GeneratedIdentifierFlags.AllowNameSubstitution);
    // const declaredNames = context.getVariableDeclarationNames();
    // context.factory.createTempVariable((node) => {
    //   console.log({ node })
    // },/*reservedInNestedScopes*/ true)
    // context.hoistVariableDeclaration(node)
    // return context.hoistVariableDeclaration(node)
    // return context.factory.createTempVariable(context.hoistVariableDeclaration, /*reservedInNestedScopes*/ true)
    // console.log("🚀 --> file: Identifier.ts --> line 9 --> Identifier --> declaredNames", declaredNames);
    //     if(ts.idText(node) in declaredNames){
    //     console.log("🚀 --> Text(node)", ts.idText(node));

    //     }

  }
  // // node
  return node
} 