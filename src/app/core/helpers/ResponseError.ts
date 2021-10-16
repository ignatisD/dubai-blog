import { IError } from "../interfaces/Error";

export class ResponseError implements IError {

    public name: string = "Error";
    public message: string;
    public details?: any;

    constructor(name: string, message: string, details?: any) {
        this.name = name;
        this.message = message;
        if (details) {
            this.details = details;
        }
    }

    static fromError(e: IError|Error) {
        let stack;
        if (e.stack) {
            stack = e.stack.split("\n");
        }
        return new ResponseError(e.name, e.message, stack);
    }

    getMessage(): string {
        return this.message;
    }

    toString(): string {
        return `${this.name}: ${this.message}`;
    }

    toObject(): object {
        return {
            [this.name]: this.message
        };
    }
}
