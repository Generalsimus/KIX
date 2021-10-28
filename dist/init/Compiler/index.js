"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const CompileFile_1 = require("./CompileFile");
const Compiler = (FilePath) => {
    (0, CompileFile_1.CompileFile)(FilePath);
    return {
        watch: () => {
        }
    };
};
exports.Compiler = Compiler;
//# sourceMappingURL=index.js.map