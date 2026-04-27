const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const GROUPS = Array.from({ length: 20 }, (_, index) => `group${index + 1}`);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        addressLine2: {
            type: String,
            trim: true,
        },
        landmark: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "delivery", "group-admin"],
            default: "user",
        },
        group: {
            type: String,
            enum: [...GROUPS, "unassigned"],
            default: "unassigned",
        },
        referralCode: {
            type: String,
            trim: true,
            uppercase: true,
            unique: true,
            sparse: true,
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        usedReferralCode: {
            type: String,
            trim: true,
            uppercase: true,
        },
        referralAssignedAt: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
        },
        lastSeen: {
            type: Date,
            default: null,
        },
        refreshTokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Add the new method here
userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    return token;
};

module.exports = mongoose.model("User", userSchema);