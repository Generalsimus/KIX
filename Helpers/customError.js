export class CustomError extends Error {
    constructor({ messageText, errorText }) {
        super();
        this.message = messageText;
        this.stack = errorText
    }
}