"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor({ messageText, errorText }) {
        super();
        this.message = messageText;
        this.stack = errorText;
    }
}
exports.CustomError = CustomError;
