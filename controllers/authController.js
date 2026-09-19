// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import transporter from "../config/nodemailer.js";
import { resetPasswordTemplate } from "../utilis/emailTemplates.js";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, username: admin.username, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
};

/* ============================================================
   REGISTER ADMIN
============================================================ */
export const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, Email, And Password Are Required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password Must Be At Least 6 Characters",
      });
    }

    const existingEmail = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Admin With This Email Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin Registered Successfully!",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email Or Password" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email Or Password" });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      token,
      user: { username: admin.username, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET ME
============================================================ */
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }
    res.json({
      success: true,
      user: { username: admin.username, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   ✅ UPDATE PROFILE — Username + Email Dono
============================================================ */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Username Is Required" });
    }

    if (!email || !email.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Email Is Required" });
    }

    /* Email Format Check */
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email Format" });
    }

    /* Check Email Not Taken By Another Admin */
    const existing = await Admin.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: req.admin.id },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already In Use" });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
      },
      { returnDocument: "after" }
    ).select("-password");

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }

    res.json({
      success: true,
      message: "Profile Updated",
      user: { username: admin.username, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   UPDATE PASSWORD
============================================================ */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password Must Be At Least 6 Characters",
      });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }

    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Current Password Is Incorrect" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   FORGOT PASSWORD
============================================================ */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email Is Required" });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.json({
        success: true,
        message: "If That Email Exists, A Reset Link Has Been Sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    admin.resetToken = token;
    admin.resetTokenExpiry = Date.now() + 30 * 60 * 1000;
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password/${token}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: admin.email,
        subject: "🔐 Password Reset - Ali Hajveri International",
        html: resetPasswordTemplate(resetUrl, admin.username),
      });
      console.log("✅ Reset Email Sent To:", admin.email);
    } catch (emailErr) {
      console.error("❌ Reset Email Failed:", emailErr.message);
    }

    res.json({
      success: true,
      message: "If That Email Exists, A Reset Link Has Been Sent",
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   VERIFY RESET TOKEN
============================================================ */
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Or Expired Token" });
    }

    res.json({ success: true, message: "Token Valid" });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   RESET PASSWORD
============================================================ */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password Must Be At Least 6 Characters",
      });
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Or Expired Token" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    res.json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};