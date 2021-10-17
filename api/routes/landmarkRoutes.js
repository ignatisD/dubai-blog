const LandmarkController = require("../controllers/LandmarkController");
const { auth, isAdmin, upload } = require("./middlewares");

const ctrl = new LandmarkController();

const landmarkRoutes = [
    {
        path: "/",
        verb: "get",
        method: "retrieve",
        ctrl: ctrl
    },
    {
        path: "/:id",
        verb: "get",
        method: "findOne",
        ctrl: ctrl
    },
    {
        path: "/:id",
        verb: "put",
        method: "update",
        ctrl: ctrl,
        middlewares: [
            auth,
            isAdmin
        ]
    },
    {
        path: "/upload/:id",
        verb: "put",
        method: "upload",
        ctrl: ctrl,
        middlewares: [
            auth,
            isAdmin,
            upload.single("photo")
        ]
    }
];

module.exports = landmarkRoutes;
