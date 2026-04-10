exports.resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedToken = typeof user.generatePasswordResetToken === "function"
            ? require("crypto").createHash("sha256").update(token).digest("hex")
            : token;

        if (
            !user.resetPasswordToken ||
            user.resetPasswordToken !== hashedToken ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < Date.now()
        ) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error during password reset" });
    }
};
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../services/email.service");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { ensureDeliveryUser, DEFAULT_DELIVERY_EMAIL, DEFAULT_DELIVERY_PASSWORD } = require("../utils/ensureDeliveryUser");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "";

const generateTokens = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        number: user.number,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });

    return { accessToken, refreshToken };
};

const getUserData = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || user.number || "",
    number: user.number || "",
    role: user.role,
});

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => {
                switch (error.path) {
                    case "name":
                        return "Name must be at least 2 characters long";
                    case "email":
                        return "Please provide a valid email address";
                    case "password":
                        return "Password must be at least 6 characters long";
                    default:
                        return error.msg;
                }
            });
            return res
                .status(400)
                .json({ message: errorMessages[0], errors: errorMessages });
        }

        const { name, email, number, password } = req.body;

        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ message: "Name, email and password are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            number: number ? String(number).trim() : "",
            password,
            isVerified: true,
            isActive: true,
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully! You can now log in.",
            email: user.email,
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: errors.array() });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (
            normalizedEmail === DEFAULT_DELIVERY_EMAIL &&
            password === DEFAULT_DELIVERY_PASSWORD
        ) {
            try {
                await ensureDeliveryUser();
            } catch (bootstrapError) {
                console.error("Delivery login bootstrap failed:", bootstrapError);
            }
        }

        let user = await User.findOne({
            email: normalizedEmail,
            isActive: true,
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        user.lastLogin = new Date();
        const { accessToken, refreshToken } = generateTokens(user);

        if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
        user.refreshTokens.push({ token: refreshToken });
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        await user.save();

        return res.status(200).json({
            message: "Login successful",
            token: accessToken,
            refreshToken,
            user: getUserData(user),
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(401).json({ message: "Refresh token is required" });

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch (e) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive)
            return res.status(401).json({ message: "Invalid refresh token" });

        const tokenExists = Array.isArray(user.refreshTokens) && user.refreshTokens.some(
            (t) => t.token === refreshToken
        );
        if (!tokenExists)
            return res.status(401).json({ message: "Refresh token not found" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        user.refreshTokens = user.refreshTokens.filter(
            (t) => t.token !== refreshToken
        );
        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        res.json({
            message: "Tokens refreshed successfully",
            token: accessToken,
            refreshToken: newRefreshToken,
            user: getUserData(user),
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const userId = req.user && req.user.id;

        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        if (refreshToken) {
            await User.findByIdAndUpdate(userId, {
                $pull: { refreshTokens: { token: refreshToken } },
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                $set: { refreshTokens: [] },
            });
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                phone: user.phone || user.number || "",
                role: user.role,
                lastLogin: user.lastLogin,
                address: user.address || "",
                addressLine2: user.addressLine2 || "",
                landmark: user.landmark || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
            },
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, number, address, addressLine2, landmark, city, state, pincode } = req.body;
        const userId = req.user && req.user.id;
        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validation: name (letters, numbers, spaces), number (digits only)
        const nameRegex = /^[A-Za-z0-9 ]+$/;
        const numberRegex = /^[0-9]+$/;
        if (name && !nameRegex.test(name)) {
            return res.status(400).json({ message: "Name can only contain letters, numbers, and spaces. No emoji or symbols allowed." });
        }
        if (number && !numberRegex.test(number)) {
            return res.status(400).json({ message: "Number can only contain digits. No emoji or symbols allowed." });
        }

        // Address field validation
        const addressFieldRegex = /^[a-zA-Z0-9\s,.\/\-]*$/;
        if (address && !addressFieldRegex.test(address)) {
            return res.status(400).json({ message: "Address can only contain letters, numbers, and basic symbols (, . - /)." });
        }
        if (addressLine2 && !addressFieldRegex.test(addressLine2)) {
            return res.status(400).json({ message: "Address Line 2 can only contain letters, numbers, and basic symbols (, . - /)." });
        }
        if (landmark && !addressFieldRegex.test(landmark)) {
            return res.status(400).json({ message: "Landmark can only contain letters, numbers, and basic symbols (, . - /)." });
        }
        if (city && !/^[a-zA-Z0-9\s]*$/.test(city)) {
            return res.status(400).json({ message: "City can only contain letters, numbers and spaces." });
        }
        if (pincode && !/^[0-9]{6}$/.test(pincode)) {
            return res.status(400).json({ message: "Please enter a valid 6-digit pincode." });
        }

        if (name) user.name = name;
        if (number) user.number = number;
        if (address !== undefined) user.address = address;
        if (addressLine2 !== undefined) user.addressLine2 = addressLine2;
        if (landmark !== undefined) user.landmark = landmark;
        if (city !== undefined) user.city = city;
        if (state !== undefined) user.state = state;
        if (pincode !== undefined) user.pincode = pincode;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                phone: user.phone || user.number || "",
                role: user.role,
                lastLogin: user.lastLogin,
                address: user.address || "",
                addressLine2: user.addressLine2 || "",
                landmark: user.landmark || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let token;
        if (typeof user.generatePasswordResetToken === "function") {
            token = await user.generatePasswordResetToken();
            if (!token && user.resetPasswordToken) token = user.resetPasswordToken;
            await user.save();
        } else {
            token = crypto.randomBytes(20).toString("hex");
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
            await user.save();
        }

        const origin = req.headers && req.headers.origin ? req.headers.origin : FRONTEND_URL;
        const resetUrl = origin
            ? `${origin.replace(/\/$/, "")}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`
            : `Please use this token to reset your password: ${token}`;

        const emailHtml = origin
            ? `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                    <p>Dear ${user.name || "User"},</p>
                    <p>We received a request to reset your password. Click the link below to reset it:</p>
                    <p><a href="${resetUrl}">Reset your password</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>— Arogya Rahita</p>
               </div>`
            : `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                    <p>Dear ${user.name || "User"},</p>
                    <p>We received a request to reset your password. Use this token to reset it:</p>
                    <pre style="padding:8px;background:#f5f5f5;border-radius:4px;">${token}</pre>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>This token will expire in 1 hour.</p>
                    <p>— Arogya Rahita</p>
               </div>`;

        try {
            await sendEmail(user.email, "Password reset request", emailHtml);
        } catch (e) {
            console.warn("Failed to send password reset email:", e.message || e);
        }

        return res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
