"use strict";
exports.__esModule = true;
exports.resetModuleThree = void 0;
var index_1 = require("../index");
var createModuleInfo_1 = require("../../utils/createModuleInfo");
var resetModuleThree = function (newModules) {
    index_1.App.moduleThree.clear();
    newModules.forEach(function (modulePath) {
        index_1.App.moduleThree.set(modulePath, (0, createModuleInfo_1.createModuleInfo)(modulePath));
    });
};
exports.resetModuleThree = resetModuleThree;
