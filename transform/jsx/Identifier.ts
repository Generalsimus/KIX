import ts from "typescript";
import { CustomContextType } from "..";

export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: CustomContextType) => {
    
    if(context.getJSXPropRegistrationIdentifier){
        const declaredNames = context.getVariableDeclarationNames();
        if(ts.idText(node) in declaredNames){
        console.log("🚀 --> Text(node)", ts.idText(node));

        }
        
    }
    // node
    return node
}