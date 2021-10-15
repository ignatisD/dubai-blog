const authRoutes = require("./authRoutes");
const landmarkRoutes = require("./landmarkRoutes");

const routes = [
    {
        path: "/auth",
        routes: authRoutes
    },
    {
        path: "/landmarks",
        routes: landmarkRoutes
    },
];

module.exports = routes;
