"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitor = void 0;
const typescript_1 = require("typescript");
const transpilers_1 = require("./transpilers");
const visitor = (NODE, CTX, META) => {
    // var new_NODE = TRANSPILER[NODE.kind] ? TRANSPILER[NODE.kind](NODE, DATA, VISITOR, CTX) : ts.visitEachChild(NODE, (NODE) => VISITOR(NODE, DATA, VISITOR, CTX), CTX)
    var newNODE = transpilers_1.transpilers[NODE.kind] || NODE;
    console.log("ZZZZZZZZZZZZZZZZZZZZZZZ", typescript_1.SyntaxKind[NODE.kind]);
    // NODE.getChildren().forEach(NODE => visitor(NODE, CTX, META));
    return typescript_1.visitEachChild(NODE, (NODE) => exports.visitor(NODE, CTX, META), CTX);
};
exports.visitor = visitor;
