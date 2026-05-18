const express = require("express");
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    getReferralCodes,
} = require("../controllers/auth.controller");
const {
    validateRegister,
    validateLogin,
} = require("../validators/auth.validators");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);
router.get("/referral-codes", getReferralCodes);
router.put("/profile", verifyToken, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;