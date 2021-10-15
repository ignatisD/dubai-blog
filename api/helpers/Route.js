const path = require("path");
const proxy = require("express-http-proxy");

class Route {

    constructor(route) {
        this.path = route.path;
        this.verb = route.verb;
        this.method = route.method;
        this.ctrl = route.ctrl;
        this.middlewares = route.middlewares || [];

        this.routes = route.routes;
        this.proxy = route.proxy;
        this.proxyOptions = route.proxyOptions || {};
    }

    pre(middlewares) {
        this.middlewares = [].concat(middlewares || []).concat(this.middlewares);
        return this;
    }

    post(middlewares) {
        this.middlewares = [].concat(this.middlewares).concat(middlewares || []);
        return this;
    }

    register(router, parentPath) {
        try {
            const actualPath = path.join(parentPath || "", this.path);
            if (this.ctrl && this.method) {
                router[this.verb](actualPath, ...this.middlewares, this.ctrl[this.method].bind(this.ctrl));
            } else if (this.routes && this.routes.length) {

                this.routes.forEach((_route) => {
                    const route = new Route(_route);
                    if (this.middlewares.length) {
                        route.pre(this.middlewares);
                    }
                    route.register(router, actualPath);
                });
            } else if (this.proxy) {
                router.all(actualPath, ...this.middlewares, proxy(this.proxy, this.proxyOptions));
            }
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = Route;
