const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const User = require("../models/User");
const Order = require("../models/Order");

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshTokens");
        const now = Date.now();
        const withPresence = users.map((u) => {
            const lastSeen = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
            const online = lastSeen && now - lastSeen <= 2 * 60 * 1000;
            return {
                id: u._id,
                name: u.name,
                email: u.email,
                number: u.number,
                role: u.role,
                group: u.group || "group1",
                isVerified: u.isVerified,
                isActive: u.isActive,
                lastLogin: u.lastLogin,
                lastSeen: u.lastSeen,
                online,
                createdAt: u.createdAt,
            };
        });
        res.json(withPresence);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update user group
router.put("/users/:userId/group", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { group } = req.body;
        const validGroups = Array.from({ length: 20 }, (_, i) => `group${i + 1}`);
        if (!group || !validGroups.includes(group)) {
            return res.status(400).json({ message: "Invalid group. Must be group1 to group20." });
        }
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.group = group;
        await user.save();
        res.json({ message: "Group updated successfully", group: user.group });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// List orders for admin
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email number phone group")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
