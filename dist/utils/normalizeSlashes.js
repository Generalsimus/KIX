"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlashes = void 0;
var backslashRegExp = /\\/g, directorySeparator = "\\";
function normalizeSlashes(path) {
    var index = path.indexOf("\\");
    if (index === -1) {
        return path;
    }
    backslashRegExp.lastIndex = index;
    return path.replace(backslashRegExp, directorySeparator);
}
exports.normalizeSlashes = normalizeSlashes;
