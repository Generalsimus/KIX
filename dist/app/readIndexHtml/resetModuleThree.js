"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetModuleThree = void 0;
const index_1 = require("../index");
const createModuleInfo_1 = require("../../utils/createModuleInfo");
const resetModuleThree = (newModules) => {
    index_1.App.moduleThree.clear();
    newModules.forEach((modulePath) => {
        index_1.App.moduleThree.set(modulePath, (0, createModuleInfo_1.createModuleInfo)(modulePath));
    });
};
exports.resetModuleThree = resetModuleThree;
