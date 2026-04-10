const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { ensureDeliveryUser, DEFAULT_DELIVERY_EMAIL, DEFAULT_DELIVERY_PASSWORD } = require("../utils/ensureDeliveryUser");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/arogyamrahita";

async function seedDeliveryUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await ensureDeliveryUser();
        console.log(`Delivery user ready: ${DEFAULT_DELIVERY_EMAIL} / ${DEFAULT_DELIVERY_PASSWORD}`);

        await mongoose.disconnect();
        console.log("Done");
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

seedDeliveryUser();
