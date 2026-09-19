import express from "express";
import {
  registerAdmin,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { validateLogin } from "../middlewares/validation.js";

const router = express.Router();

// Public
router.post("/register", registerAdmin);
router.post("/login", validateLogin, login);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Protected
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

export default router;