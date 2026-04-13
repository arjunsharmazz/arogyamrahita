const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        youtubeUrl: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeVideoId: {
            type: String,
            required: true,
            trim: true,
        },
        embedUrl: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            trim: true,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Video", videoSchema);
