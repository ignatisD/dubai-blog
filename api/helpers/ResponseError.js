class ResponseError {

    constructor(name, message, details) {
        this.name = name;
        this.message = message;
        if (details) {
            this.details = details;
        }
    }

    static fromError(e) {
        let stack;
        if (e.stack) {
            stack = e.stack.split("\n");
        }
        return new ResponseError(e.name, e.message, stack);
    }

    getMessage() {
        return this.message;
    }

    toString() {
        return `${this.name}: ${this.message}`;
    }

    toObject() {
        return {
            [this.name]: this.message
        };
    }
}

module.exports = ResponseError;
