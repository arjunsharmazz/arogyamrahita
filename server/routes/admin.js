const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const User = require("../models/User");
const Order = require("../models/Order");

const GROUPS = Array.from({ length: 20 }, (_, index) => `group${index + 1}`);
const GROUP_ADMIN_ROLE = "group-admin";

const normalizeReferralCode = (value = "") => value.trim().toUpperCase();

const getReferralCounts = async () => {
    const [referredCounts, groupCounts] = await Promise.all([
        User.aggregate([
            { $match: { referredBy: { $ne: null } } },
            { $group: { _id: "$referredBy", total: { $sum: 1 } } },
        ]),
        User.aggregate([
            { $match: { group: { $in: GROUPS }, role: { $ne: "admin" } } },
            { $group: { _id: "$group", total: { $sum: 1 } } },
        ]),
    ]);

    return {
        referredByUserId: referredCounts.reduce((acc, item) => {
            acc[String(item._id)] = item.total;
            return acc;
        }, {}),
        groupTotals: groupCounts.reduce((acc, item) => {
            acc[item._id] = item.total;
            return acc;
        }, {}),
    };
};

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -refreshTokens")
            .populate("referredBy", "name email group referralCode");
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
                group: u.group || "unassigned",
                referralCode: u.referralCode || "",
                usedReferralCode: u.usedReferralCode || "",
                referredById: u.referredBy?._id || null,
                referredByName: u.referredBy?.name || "",
                referredByGroup: u.referredBy?.group || "",
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
        if (!group || ![...GROUPS, "unassigned"].includes(group)) {
            return res.status(400).json({ message: "Invalid group." });
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

router.get("/group-admins", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [groupAdmins, counts] = await Promise.all([
            User.find({ role: GROUP_ADMIN_ROLE, isActive: true })
                .select("name email number group referralCode createdAt lastLogin")
                .sort({ group: 1, name: 1 }),
            getReferralCounts(),
        ]);

        const response = groupAdmins.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            number: user.number,
            group: user.group || "unassigned",
            referralCode: user.referralCode || "",
            joinedUsersCount: counts.referredByUserId[String(user._id)] || 0,
            totalGroupMembers: counts.groupTotals[user.group] || 0,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        }));

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/users/:userId/group-admin", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { group, referralCode } = req.body;
        const normalizedReferralCode = normalizeReferralCode(referralCode);

        if (!group || !GROUPS.includes(group)) {
            return res.status(400).json({ message: "Invalid group. Must be group1 to group20." });
        }

        if (!/^[A-Z0-9_-]{4,20}$/.test(normalizedReferralCode)) {
            return res.status(400).json({ message: "Referral code must be 4-20 characters using letters, numbers, dash or underscore." });
        }

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "admin" || user.role === "delivery") {
            return res.status(400).json({ message: "This user cannot be assigned as a group admin." });
        }

        const [existingGroupOwner, existingReferralCodeOwner] = await Promise.all([
            User.findOne({
                _id: { $ne: user._id },
                role: GROUP_ADMIN_ROLE,
                group,
            }),
            User.findOne({
                _id: { $ne: user._id },
                referralCode: normalizedReferralCode,
            }),
        ]);

        if (existingGroupOwner) {
            return res.status(400).json({ message: `${group} is already assigned to another group admin.` });
        }

        if (existingReferralCodeOwner) {
            return res.status(400).json({ message: "Referral code already assigned to another user." });
        }

        user.role = GROUP_ADMIN_ROLE;
        user.group = group;
        user.referralCode = normalizedReferralCode;
        await user.save();

        res.json({
            message: "Group admin updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                group: user.group,
                referralCode: user.referralCode,
            },
        });
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
