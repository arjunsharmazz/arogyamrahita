const HomeBanner = require("../models/HomeBanner");

const buildBannerPayload = (payload = {}) => ({
    image: payload.image?.trim(),
    title: payload.title?.trim() || "",
    subtitle: payload.subtitle?.trim() || "",
    sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
    isActive: payload.isActive === undefined ? true : Boolean(payload.isActive),
});

exports.getActive = async (_req, res) => {
    try {
        const items = await HomeBanner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminList = async (_req, res) => {
    try {
        const items = await HomeBanner.find().sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const payload = buildBannerPayload(req.body);
        if (!payload.image) {
            return res.status(400).json({ success: false, message: "Banner image is required" });
        }

        const created = await HomeBanner.create({
            ...payload,
            createdBy: req.user?.id || null,
        });
        res.status(201).json({ success: true, data: created });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const payload = buildBannerPayload(req.body);
        if (!payload.image) {
            return res.status(400).json({ success: false, message: "Banner image is required" });
        }

        const updated = await HomeBanner.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await HomeBanner.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        res.json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};