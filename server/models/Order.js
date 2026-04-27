const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                image: { type: String },
                variant: {
                    name: { type: String },
                    weight: { type: Number },
                    weightUnit: { type: String },
                },
            },
        ],
        totalAmount: { type: Number, required: true },
        invoiceNumber: { type: Number, unique: true }, // 👈 add kiya
        status: {
            type: String,
            enum: [
                "PLACED",
                "PAID",
                "READY_FOR_DELIVERY",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
        },
        shippingAddress: {
            name: { type: String },
            address: { type: String },
            addressLine2: { type: String },
            landmark: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            phone: { type: String },
            latitude: { type: Number },
            longitude: { type: Number },
        },
        paymentInfo: {
            method: { type: String },
            transactionId: { type: String },
        },
        paymentCollectedAs: {
            type: String,
            enum: ["cash", "upi", "due", "online", null],
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);