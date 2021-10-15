const ResponseError = require("./ResponseError");

class JsonResponse {

    static get responseError() {
        return new ResponseError("Error", "Your request resulted in an error.");
    }

    constructor(instance) {
        this.success = true;
        this.key = "data";
        if (instance !== undefined) {
            Object.assign(this, instance);
        }
        if (this.success === undefined) {
            this.success = !this.errors;
        }
    }

    get() {
        return this[this.key];
    }

    set(key, data) {
        this[key] = data;
        return this;
    }

    reason() {
        if (this.success) {
            return "";
        }
        return ((this.errors ? this.errors[0] : null) || JsonResponse.responseError).toString();
    }

    ok(data, key, details) {
        this.success = true;
        this.key = key || "data";
        this[this.key] = data;
        if (details) {
            this.details = details;
        }
        return this;
    }

    fail(errors, details) {
        this.success = false;
        this.errors = errors || [JsonResponse.responseError];
        if (details) {
            this.details = details;
        }
        return this;
    }

    addError(error) {
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

    error(error, details) {
        this.success = false;
        if (details) {
            this.details = details;
        }
        let err = error ? new ResponseError("Error", error) : JsonResponse.responseError;
        this.addError(err);
        return this;
    }

    exception(error, details) {
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

    toString() {
        return this.toJson();
    }

    toJson() {
        return JSON.stringify(this);
    }

    static caught(exception, details) {
        return new JsonResponse().exception(exception, details);
    }

    static notImplemented() {
        return new JsonResponse().error(new ResponseError("Error", "Not implemented"));
    }

    static succeed(data, details) {
        return new JsonResponse().ok(data, "data", details);
    }
}

module.exports = JsonResponse;
