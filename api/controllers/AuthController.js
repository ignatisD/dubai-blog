const JsonResponse = require("../helpers/JsonResponse");

class AuthController {

    async status(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.user) {
                res.status(401).json(response.error("Session missing"));
                return;
            }
            res.json(response.ok(req.user));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }

    async login(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.body || !req.body.username || !req.body.password) {
                res.status(422).json(response.error("Username and password are required"));
                return;
            }
            const user = await global.Parse.User.logIn(req.body.username, req.body.password);
            if (!user) {
                res.status(401).send(response.error("Authentication failure"));
            } else {
                res.json(response.ok(user));
            }
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }

    async logout(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.user) {
                res.status(401).json(response.error("Session missing"));
                return;
            }
            await global.Parse.User.logOut({sessionToken: req.user.getSessionToken()});
            res.json(response.ok(true));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }
}

module.exports = AuthController;
