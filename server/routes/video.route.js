const express = require("express");
const router = express.Router();
const controller = require("../controllers/video.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/active", controller.getActiveVideos);

router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

router.get("/admin/all", controller.adminList);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
