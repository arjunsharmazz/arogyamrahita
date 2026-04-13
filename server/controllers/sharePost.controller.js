const SharePost = require("../models/SharePost");

const buildPayload = (payload) => {
    const title = payload.title?.trim();
    const description = payload.description?.trim() || "";
    const content = payload.content?.trim() || "";
    const imageUrl = payload.imageUrl?.trim();
    const sortOrder = Number(payload.sortOrder || 0);
    const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);

    if (!title || !imageUrl) {
        const error = new Error("Title and image are required");
        error.statusCode = 400;
        throw error;
    }

    return {
        title,
        description,
        content,
        imageUrl,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
};

exports.getActivePosts = async (_req, res) => {
    try {
        const posts = await SharePost.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const post = await SharePost.findById(req.params.id);
        if (!post || !post.isActive) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminList = async (_req, res) => {
    try {
        const posts = await SharePost.find().sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const doc = await SharePost.create({
            ...buildPayload(req.body),
            createdBy: req.user?.id || null,
        });
        res.status(201).json({ success: true, data: doc });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await SharePost.findByIdAndUpdate(req.params.id, buildPayload(req.body), {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await SharePost.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};