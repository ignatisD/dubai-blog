const http           = require("http");
const dotenv         = require("dotenv");
const express        = require("express");
const bodyParser     = require("body-parser");
const cors           = require("cors");
const {ParseServer}  = require("parse-server");
const ParseDashboard = require("parse-dashboard");
const Parse          = require("parse/node");
const Route          = require("./helpers/Route");
const JsonResponse   = require("./helpers/JsonResponse");


class Server {

    constructor(envFile) {
        this.envFile = envFile || ".env";
    }

    static bootstrap(envFile) {
        return new Server(envFile).init();
    }

    init() {

        // Load environment variables
        this.env();

        // Connect to the database
        this.parse();

        // Create and configure the express application
        this.express();

        // Create the http server
        this.createServer();

        return this;
    }

    env() {
        dotenv.config({path: this.envFile});
        this.port = parseInt(process.env.SERVER_PORT || "5000");
    }

    parse() {
        // Init ParseServer
        this.api            = new ParseServer({
            databaseURI: process.env.DB_URI,
            appId      : process.env.APP_ID,
            masterKey  : process.env.MASTER_KEY,
            fileKey    : process.env.FILE_KEY,
            serverURL  : process.env.SERVER_URL,
            maxUploadSize: "5mb"
        });
        // Start Parse Dashboard
        this.parseDashboard = new ParseDashboard({
            apps: [
                {
                    serverURL               : process.env.SERVER_URL,
                    appId                   : process.env.APP_ID,
                    masterKey               : process.env.MASTER_KEY,
                    appName                 : process.env.APP_NAME,
                    appNameForURL           : process.env.APP_NAME.toLowerCase(),
                    primaryBackgroundColor  : "#000000",
                    secondaryBackgroundColor: "#3B3B3B"
                }
            ],
            users: [
                {
                    user: "admin",
                    pass: process.env.APP_PASS
                }
            ]
        }, {
            allowInsecureHTTP: true
        });
        // Start Parse (will be available globally)
        Parse.initialize(process.env.APP_ID, process.env.MASTER_KEY);
    }

    express() {
        this.app = express();
        this.app.set("port", this.port);
        this.app.set("etag", false);
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use("/api/parse", this.api);
        this.app.use("/api/dashboard", this.parseDashboard);

        const routes = require("./routes/routes");
        const router = express.Router();

        routes.forEach(r => {
            const route = new Route(r);
            route.register(router);
        })

        router.use((req, res) => {
            res.status(404).json(new JsonResponse().error("Not Found"));
        });

        this.app.use(router);
    }

    createServer() {

        this._server = http.createServer(this.app);
        this._server.listen(this.port);
        this._server.timeout = 600000;

        this._server.on("listening", () => {
            console.info(`  App is running at http://127.0.0.1:${this.port} in ${process.env.NODE_ENV} mode`);
            console.info("  Press CTRL+C to stop");
        });

        this._server.on("error", console.error);

        process.on("exit", (code) => {
            console.warn("Process exiting with code:", code);
        });

        if (process.env.NODE_ENV !== "development") {
            process.on("SIGINT", this.shutdown.bind(this));

            process.on("SIGTERM", this.shutdown.bind(this));

            process.on("SIGUSR2", this.shutdown.bind(this));
        } else {
            process.on("warning", (warning) => {
                console.log(warning.stack?.split("\n"));
            });
        }

    }

    async close() {
        return new Promise((resolve) => {
            const timeout = setTimeout(resolve, 5000);
            this._server.close((err) => {
                clearTimeout(timeout);
                if (err) {
                    console.error("Express stopped: ", err);
                } else {
                    console.warn("Express stopped: no errors");
                }
                resolve();
            });
        });
    }

    async disconnect() {
        try {
            await this.api.disconnect();
            console.info("Parse Server disconnect: no errors");
        } catch (e) {
            console.error("Parse Server disconnect: ", e);
        }
    }

    async shutdown(term) {
        console.warn("STOP SERVER: " + (term || "SIGTERM"));
        try {
            await this.close();
            await this.disconnect();
            process.exit(0);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
}

module.exports = Server;
