const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdminOrDelivery, verifyDelivery } = require("../middlewares/auth.middleware");
const { createDeliveryLog, listDeliveryLogs, deleteDeliveryLog } = require("../controllers/deliveryLog.controller");

router.get("/", verifyToken, verifyAdminOrDelivery, listDeliveryLogs);
router.post("/", verifyToken, verifyDelivery, createDeliveryLog);
router.delete("/:id", verifyToken, verifyAdminOrDelivery, deleteDeliveryLog);

module.exports = router;