const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        oldPrice: {
            type: Number,
            required: true,
        },
        newPrice: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            default: "general",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        weight: {
            type: Number,
            required: true,
        },
        weightUnit: {
            type: String,
            enum: ["kg", "gm", "mg", "lb", "oz"],
            required: true,
        },
        variants: [
            {
                name: { type: String, required: true }, // e.g., 'Small', 'Red', etc.
                additionalPrice: { type: Number, default: 0 },
                stock: { type: Number, default: 0 },
                sku: { type: String },
                // Add more fields as needed (e.g., color, size)
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
