const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyAdminOrDelivery } = require("../middlewares/auth.middleware");
const {
    createOrder,
    getMyOrders,
    listOrders,
    updateOrderStatus,
    bulkAcceptOrders,
} = require("../controllers/order.controller");

router.post("/", verifyToken, createOrder);
router.get("/my", verifyToken, getMyOrders);

router.get("/", verifyToken, verifyAdminOrDelivery, listOrders);
router.put("/:orderId/status", verifyToken, verifyAdminOrDelivery, updateOrderStatus);
router.post("/bulk-accept", verifyToken, verifyAdmin, bulkAcceptOrders);

module.exports = router;


