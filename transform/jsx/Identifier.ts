import ts from "typescript";
import { CustomContextType } from "..";

export const Identifier = (node: ts.Identifier, visitor: ts.Visitor, context: CustomContextType) => {
    
    if(context.getJSXPropRegistrationIdentifier){
        // console.log("🚀 --> file: Identifier.ts --> line 7 --> Identifier --> context", context);
        const declaredNames = context.getVariableDeclarationNames();
        if(ts.idText(node) in declaredNames){
        console.log("🚀 --> Text(node)", ts.idText(node));

        }
        
    }
    // node
    return node
}