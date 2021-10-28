"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSXTransformersBefore = void 0;
const typescript_1 = require("typescript");
exports.JSXTransformersBefore = {
    [typescript_1.SyntaxKind.JsxElement]: (NODE, visitor, CTX) => {
        const { openingElement: { tagName, attributes }, children } = NODE;
        // console.log("🚀 ---> file: JSX.js ---> line 10 ---> tagName", idText(tagName)) 
        console.log("🚀 ---> file: JSX.js ---> line 10 ---> attributes", attributes);
        return NODE;
    }
};
//# sourceMappingURL=JSX.js.map