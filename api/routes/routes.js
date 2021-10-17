const authRoutes = require("./authRoutes");
const landmarkRoutes = require("./landmarkRoutes");

const routes = [
    {
        path: "/api/auth",
        routes: authRoutes
    },
    {
        path: "/api/landmarks",
        routes: landmarkRoutes
    },
];

module.exports = routes;
