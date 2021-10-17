import { IError } from "../interfaces/Error";
import { ResponseError } from "./ResponseError";
import { IResponse } from "../interfaces/Response";
import { map } from "rxjs/operators";

export class JsonResponse<T = any> implements IResponse<T> {

    public success: boolean = true;
    public key: string = "data";
    public errors?: IError[];
    [key: string]: T|any;

    constructor(instance?: IResponse) {
        if (instance) {
            Object.assign(this, instance);
        }
    }

    public static get responseError() {
        return new ResponseError("ResponseError", "Your request resulted in an error.");
    }

    public get(): T {
        return this[this.key];
    }

    public set(key: string, data: any): this {
        this[key] = data;
        return this;
    }

    public reason(): string {
        if (this.success) {
            return "";
        }
        return (this.errors?.[0]?.message || JsonResponse.responseError).toString();
    }

    public ok(data: T, key: string = "data", details?: any): this {
        this.success = true;
        this.key = key || "data";
        this[this.key] = data;
        if (details) {
            this.details = details;
        }
        return this;
    }

    public fail(errors: IError[], details?: any): this {
        this.success = false;
        this.errors = errors || [JsonResponse.responseError];
        if (details) {
            this.details = details;
        }
        return this;
    }

    public addError(error: IError): this {
        if (!this.errors) {
            this.errors = [];
        }
        if (Array.isArray(error)) {
            this.errors.push(...error);
        } else {
            this.errors.push(error);
        }
        return this;
    }

    public error(errorMessage: string, details?: any): this {
        this.success = false;
        if (details) {
            this.details = details;
        }
        const error = errorMessage ? new ResponseError("Error", errorMessage) : JsonResponse.responseError;
        this.addError(error);
        return this;
    }

    public exception(error: IError|Error, details?: any): this {
        this.success = false;
        if (error) {
            this.addError(ResponseError.fromError(error));
        } else {
            this.addError(new ResponseError("Error", "The request resulted in an Exception"));
        }
        if (details) {
            this.details = details;
        }
        return this;
    }

    public toString(): string {
        return this.toJson();
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    public static caught<T>(exception: IError, details?: any) {
        return new JsonResponse<T>().exception(exception, details);
    }

    public static notImplemented<T>() {
        return new JsonResponse<T>().error("Not implemented");
    }

    public static succeed<T = any>(data: T, details: any) {
        return new JsonResponse<T>().ok(data, "data", details);
    }

    public static format<T>() {
        return map((res: IResponse<T>| any) => {
            return new JsonResponse<T>(res);
        })
    }
}
