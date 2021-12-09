"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minify = void 0;
const App_1 = require("../init/App");
const minify = (fileCode, sourceMap) => {
    const minify = require("babel-minify");
    return minify(fileCode, {}, {
        sourceMaps: !!App_1.App.__compilerOptions.sourceMap,
        inputSourceMap: typeof sourceMap === "string" ? JSON.parse(sourceMap) : sourceMap,
        comments: !!App_1.App.__compilerOptions.removeComments,
    });
};
exports.minify = minify;
