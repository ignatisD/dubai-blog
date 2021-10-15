const path = require("path");
const sharp = require("sharp");
const JsonResponse = require("../helpers/JsonResponse");
const CrudController = require("./CrudController");

class LandmarkController extends CrudController {

    constructor() {
        super("Landmark");
    }

    async update(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.params.id) {
                res.json(response.error("ID is required"));
                return;
            }
            const landmark = await this.query().get(req.params.id);
            if (!landmark) {
                res.json(response.error("Not found"));
                return;
            }

            const canBeUpdated = ["title", "short_info", "description", "location"];
            for (const key of canBeUpdated) {
                if (!req.body.hasOwnProperty(key)) {
                    continue;
                }
                landmark.set(key, req.body[key]);
            }
            const result = await landmark.save();

            res.json(response.ok(result));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }

    }

    async upload(req, res) {
        try {
            const response = new JsonResponse();
            if (!req.params.id || !req.file) {
                res.json(response.error("ID and image file are required"));
                return;
            }
            const landmark = await this.query().get(req.params.id);
            if (!landmark) {
                res.json(response.error("Not found"));
                return;
            }
            // since using multer we have a req.file available

            // first save the original image
            const file = path.parse(req.file.originalname);
            const filename = file.base;
            const base64File = req.file.buffer.toString("base64");
            const originalImage = new global.Parse.File(filename, {base64: base64File});
            await originalImage.save();

            // then create a thumbnail
            const thumbnailName = `${file.name}_thumb${file.ext}`;
            const sharpBuffer = await sharp(req.file.buffer).rotate().resize(250, 250).toBuffer();
            const sharpBufferBase64 = sharpBuffer.toString("base64");
            const thumbnail = new global.Parse.File(thumbnailName, {base64: sharpBufferBase64});
            await thumbnail.save();

            // now add them to the landmark
            landmark.set("photo", originalImage);
            landmark.set("photo_thumb", thumbnail);
            const result = await landmark.save();

            res.json(response.ok(result));
        } catch (e) {
            console.error(e);
            res.status(500).json(JsonResponse.caught(e));
        }
    }
}

module.exports = LandmarkController;