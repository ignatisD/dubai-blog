const JsonResponse = require("../helpers/JsonResponse");

class CrudController {

    constructor(model) {
        this.modelName = model;
        this.model = global.Parse.Object.extend(model);
    }

    query() {
        return new global.Parse.Query(this.model);
    }

    async create(req, res) {
        res.json(JsonResponse.notImplemented());
    }

    async retrieve(req, res) {
        try {
            const query = this.query();
            if (req.query && req.query.sort) {
                if (req.query.sort.startsWith("-")) {
                    query.descending(req.query.sort.substr(1));
                }
                const sort = req.query.sort.startsWith("+") ? req.query.sort.substr(1) : req.query.sort;
                query.ascending(sort);
            }
            const results = await query.find();
            res.json(JsonResponse.succeed(results || []));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }

    async findOne(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.params.id) {
                res.json(response.error("ID is required"));
                return;
            }
            const query = this.query();
            const modelInstance = await query.get(req.params.id);
            if (!modelInstance) {
                res.status(404).json(response.error("Not found"));
                return;
            }
            res.json(response.ok(modelInstance));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }

    async update(req, res) {
        res.json(JsonResponse.notImplemented());
    }

    async delete(req, res) {
        res.json(JsonResponse.notImplemented());
    }
}

module.exports = CrudController;
