const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdminOrDelivery, verifyDelivery } = require("../middlewares/auth.middleware");
const { createDeliveryLog, listDeliveryLogs } = require("../controllers/deliveryLog.controller");

router.get("/", verifyToken, verifyAdminOrDelivery, listDeliveryLogs);
router.post("/", verifyToken, verifyDelivery, createDeliveryLog);

module.exports = router;