"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoTsConfigObject = void 0;
const App_1 = require("../App");
const getDemoTsConfigObject = () => {
    return {
        compilerOptions: {
            ...App_1.App.priorityCompilerOptions,
            module: "amd",
            moduleResolution: "node",
        }
    };
};
exports.getDemoTsConfigObject = getDemoTsConfigObject;
