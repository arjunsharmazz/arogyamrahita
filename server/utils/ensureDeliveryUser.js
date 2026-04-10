const User = require("../models/User");

const DEFAULT_DELIVERY_EMAIL = "uncle@gmail.com";
const DEFAULT_DELIVERY_PASSWORD = "uncle123";

async function getAvailableNumber() {
    let counter = 1;

    while (counter < 1000) {
        const candidate = `700000${String(counter).padStart(4, "0")}`;
        const existing = await User.findOne({ number: candidate }).select("_id");
        if (!existing) {
            return candidate;
        }
        counter += 1;
    }

    throw new Error("Could not find an available mobile number for delivery user");
}

async function ensureDeliveryUser() {
    const existing = await User.findOne({ email: DEFAULT_DELIVERY_EMAIL }).select("+password");

    if (existing) {
        let shouldSave = false;

        if (existing.role !== "delivery") {
            existing.role = "delivery";
            shouldSave = true;
        }

        if (!existing.isActive) {
            existing.isActive = true;
            shouldSave = true;
        }

        if (!existing.isVerified) {
            existing.isVerified = true;
            shouldSave = true;
        }

        const passwordMatches = await existing.comparePassword(DEFAULT_DELIVERY_PASSWORD);
        if (!passwordMatches) {
            existing.password = DEFAULT_DELIVERY_PASSWORD;
            shouldSave = true;
        }

        if (shouldSave) {
            await existing.save();
        }

        return existing;
    }

    const availableNumber = await getAvailableNumber();
    const user = new User({
        name: "Delivery Boy",
        email: DEFAULT_DELIVERY_EMAIL,
        number: availableNumber,
        password: DEFAULT_DELIVERY_PASSWORD,
        role: "delivery",
        isVerified: true,
        isActive: true,
    });
    await user.save();
    return user;
}

module.exports = {
    ensureDeliveryUser,
    DEFAULT_DELIVERY_EMAIL,
    DEFAULT_DELIVERY_PASSWORD,
};