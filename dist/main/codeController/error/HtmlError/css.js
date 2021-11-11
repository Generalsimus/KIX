"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorCode = void 0;
const index_1 = __importDefault(require("../../../index"));
const createErrorCode = () => {
    return (0, index_1.default)(document.body, { div: "sdsadss" });
};
exports.createErrorCode = createErrorCode;
