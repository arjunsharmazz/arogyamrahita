const Video = require("../models/Video");

const extractYouTubeVideoId = (url = "") => {
    const trimmedUrl = url.trim();
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = trimmedUrl.match(pattern);
        if (match?.[1]) {
            return match[1];
        }
    }

    return "";
};

const buildVideoPayload = (payload) => {
    const title = payload.title?.trim();
    const youtubeUrl = payload.youtubeUrl?.trim();
    const description = payload.description?.trim() || "";
    const sortOrder = Number(payload.sortOrder || 0);
    const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);

    if (!title || !youtubeUrl) {
        const error = new Error("Title and YouTube URL are required");
        error.statusCode = 400;
        throw error;
    }

    const youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
    if (!youtubeVideoId) {
        const error = new Error("Please provide a valid YouTube URL");
        error.statusCode = 400;
        throw error;
    }

    return {
        title,
        description,
        youtubeUrl,
        youtubeVideoId,
        embedUrl: `https://www.youtube.com/embed/${youtubeVideoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
        isActive,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
};

exports.getActiveVideos = async (_req, res) => {
    try {
        const videos = await Video.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminList = async (_req, res) => {
    try {
        const videos = await Video.find().sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const doc = await Video.create({
            ...buildVideoPayload(req.body),
            createdBy: req.user?.id || null,
        });
        res.status(201).json({ success: true, data: doc });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await Video.findByIdAndUpdate(
            req.params.id,
            buildVideoPayload(req.body),
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Video.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }
        res.json({ success: true, message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
