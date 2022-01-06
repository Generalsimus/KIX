"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleInfo = void 0;
let globalModuleIndex = 1;
const createModuleInfo = (modulePath) => {
    return {
        modulePath,
        moduleIndex: globalModuleIndex++,
        moduleCollection: {},
        isNodeModule: /[/\\]node_modules[/\\]/.test(modulePath),
    };
};
exports.createModuleInfo = createModuleInfo;
