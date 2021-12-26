"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kix_1 = __importDefault(require("kix"));
exports.A = (urlPath, ...moduleLocations) => {
    const getModule = () => {
        let module = window;
        for (const key of moduleLocations) {
            module = (module || {})[key];
        }
        return module;
    };
    return new Promise((resolve, reject) => {
        const module = getModule();
        module ? resolve(module) : (0, kix_1.default)(document.head, {
            script: null,
            src: urlPath,
            e: {
                load: () => {
                    const module = getModule();
                    module ? resolve(module) : reject(module);
                }
            }
        });
    });
};
