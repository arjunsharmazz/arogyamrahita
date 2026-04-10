const mongoose = require("mongoose");

const deliveryDistanceLogSchema = new mongoose.Schema(
    {
        deliveryBoy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        entryDate: {
            type: String,
            required: true,
        },
        distanceKm: {
            type: Number,
            required: true,
            min: 0.1,
        },
        routeText: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DeliveryDistanceLog", deliveryDistanceLogSchema);