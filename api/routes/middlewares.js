const path         = require("path");
const multer       = require("multer");
const JsonResponse = require("../helpers/JsonResponse");

const auth = async (req, res, next) => {
    const response = new JsonResponse();
    try {
        const token = req.header("token");
        const query = new global.Parse.Query("_Session");

        const session = await query.equalTo("sessionToken", token)
            .include("user")
            .first({useMasterKey: true});
        if (!session) {
            res.sendStatus(401);
            return;
        }
        req.user = session.get("user");

        next();
    } catch (e) {
        console.error(e);
        res.json(response.exception(e));
    }
}

const isAdmin = async (req, res, next) => {
    const response = new JsonResponse();
    try {
        if (!req.user || !req.user.id) {
            res.sendStatus(401);
            return;
        }
        const Role      = global.Parse.Object.extend("_Role");
        const roleQuery = new global.Parse.Query(Role);
        const adminRole = await roleQuery.equalTo("name", "administrator").first({useMasterKey: true});

        const user = await new global.Parse.Relation(adminRole, "users")
            .query()
            .equalTo("objectId", req.user.id)
            .first({useMasterKey: true});

        if (!user) {
            res.sendStatus(401);
            return;
        }

        req.isAdmin = true;

        next();
    } catch (e) {
        console.error(e);
        res.json(response.exception(e));
    }
}
const uploadFilter = (req, file, callback) => {
    if (/image\/(jpe?g|png)/.test(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("The system does not allow photos larger than 5MB to be uploaded"), false);
    }
};

const upload = multer({
    storage   : multer.memoryStorage(),
    limits    : {
        fileSize: 5_242_880 // 5 MB
    },
    fileFilter: uploadFilter
});

const uploadDisk = multer({
    storage   : multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.join(__dirname, "../../uploads"));
        }
    }),
    limits    : {
        fileSize: 5_242_880 // 5 MB
    },
    fileFilter: uploadFilter
});

module.exports = {
    auth,
    isAdmin,
    upload,
    uploadDisk
}
