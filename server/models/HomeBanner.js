const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
            default: "",
        },
        subtitle: {
            type: String,
            trim: true,
            default: "",
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
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

module.exports = mongoose.model("HomeBanner", homeBannerSchema);