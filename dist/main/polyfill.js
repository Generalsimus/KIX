"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kix_1 = __importDefault(require("kix"));
exports.A = (urlPath, module) => new Promise((resolve, reject) => {
    module ? resolve(module) : (0, kix_1.default)(document.head, {
        script: null,
        src: urlPath,
        e: {
            load: () => resolve(module)
        }
    });
});
