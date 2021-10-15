const AuthController     = require("../controllers/AuthController");
const {auth} = require("./middlewares");
const JsonResponse       = require("../helpers/JsonResponse");

const authController = new AuthController();

const authRoutes = [
    {
        path  : "/",
        verb  : "get",
        ctrl  : {
            handle: (req, res) => {
                res.json(JsonResponse.succeed(true));
            }
        },
        method: "handle"
    },
    {
        path       : "/status",
        verb       : "get",
        ctrl       : authController,
        method     : "status",
        middlewares: [
            auth
        ]
    },
    {
        path  : "/login",
        verb  : "post",
        ctrl  : authController,
        method: "login"
    },
    {
        path  : "/logout",
        verb  : "post",
        ctrl  : authController,
        method: "logout",
        middlewares: [
            auth
        ]
    }
];

module.exports = authRoutes;
