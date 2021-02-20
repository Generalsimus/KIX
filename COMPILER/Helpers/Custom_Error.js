class CustomError extends Error {
    constructor(message, code = null, status = null, stack = null, name = null) {
        super();
        this.message = message;
        this.status = 500;

        this.name = name || this.constructor.name;
        this.code = code || `E_${this.name.toUpperCase()}`;
        this.stack = stack || null;
    }

    static fromObject(error) {
        if (error instanceof HttpError) {
            return error;
        }
        else {
            const { message, code, status, stack } = error;
            return new ServerError(message, code, status, stack, error.constructor.name);
        }
    }

    expose() {
        if (this instanceof ClientError) {
            return { ...this };
        }
        else {
            return {
                name: this.name,
                code: this.code,
                status: this.status,
            }
        }
    }
}

module.exports = CustomError;