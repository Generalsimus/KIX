"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleInfo = void 0;
const app_1 = require("../app");
let globalModuleIndex = 1;
const getModuleInfo = (modulePath) => {
    return app_1.App.moduleThree.get(modulePath) || {
        modulePath,
        moduleIndex: globalModuleIndex++,
        moduleCollection: {},
        isNodeModule: /[/\\]node_modules[/\\]/.test(modulePath),
        writers: {}
    };
};
exports.getModuleInfo = getModuleInfo;
