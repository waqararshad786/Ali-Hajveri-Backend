// backend/controllers/cvController.js
import CV from "../models/CV.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import {
  sendCVConfirmationEmail,
  sendCVReplyEmail,           // ✅ ADD
} from "../utilis/email.js";

/* ============================================================
   SUBMIT CV — Public Route
============================================================ */
export const submitCV = async (req, res) => {
  try {
    const cv = new CV({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp,
      city: req.body.city,
      country: req.body.country,
      position: req.body.position,
      category: req.body.category,
      experience: req.body.experience,
      education: req.body.education,
      passport: req.body.passport,
      skills: req.body.skills,
      message: req.body.message,

      fileName: req.file?.originalname || "",
      filePath: req.file?.path || "",
      fileUrl: req.file?.path ? `/${req.file.path.replace(/\\/g, "/")}` : "",
      fileSize: req.file?.size || 0,
      mimeType: req.file?.mimetype || "",
    });

    await cv.save();

    sendCVConfirmationEmail({
      to: cv.email,
      name: cv.fullName,
    }).catch((err) => console.error("CV Confirmation Email Failed:", err));

    res.status(201).json({ success: true, cv });
  } catch (err) {
    console.error("CV Submit Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ALL CVs — Admin Only
============================================================ */
export const getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.find().sort({ createdAt: -1 });
    res.json({ success: true, cvs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET CV FILE — Open / Download
============================================================ */
export const getCVFile = async (req, res) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not Authorized. Token Missing." });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Or Expired Token" });
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV Not Found" });

    const filePath = cv.filePath || cv.fileUrl;
    if (!filePath) {
      return res.status(404).json({ message: "File Not Available" });
    }

    if (/^https?:\/\//i.test(filePath)) {
      return res.redirect(filePath);
    }

    let absolutePath = filePath;

    if (absolutePath.startsWith("/")) {
      absolutePath = absolutePath.substring(1);
    }

    if (!path.isAbsolute(absolutePath)) {
      absolutePath = path.join(process.cwd(), absolutePath);
    }

    if (!fs.existsSync(absolutePath)) {
      console.error("File Not Found On Disk:", absolutePath);
      return res.status(404).json({ message: "File Missing On Server" });
    }

    if (req.query.download === "1") {
      return res.download(absolutePath, cv.fileName || "cv.pdf");
    }

    res.setHeader("Content-Type", cv.mimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${cv.fileName || "cv.pdf"}"`
    );
    return res.sendFile(absolutePath);
  } catch (err) {
    console.error("CV File Error:", err);
    res.status(500).json({ message: "Failed To Serve File" });
  }
};

/* ============================================================
   UPDATE CV STATUS — Admin Only
============================================================ */
export const updateCVStatus = async (req, res) => {
  try {
    const cv = await CV.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );
    if (!cv) return res.status(404).json({ message: "CV Not Found" });
    res.json({ success: true, cv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   DELETE CV — Admin Only
============================================================ */
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findByIdAndDelete(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV Not Found" });

    if (cv.filePath) {
      let fileOnDisk = cv.filePath;
      if (fileOnDisk.startsWith("/")) fileOnDisk = fileOnDisk.substring(1);
      if (!path.isAbsolute(fileOnDisk)) {
        fileOnDisk = path.join(process.cwd(), fileOnDisk);
      }
      if (fs.existsSync(fileOnDisk)) {
        try {
          fs.unlinkSync(fileOnDisk);
        } catch (e) {
          console.warn("File Delete Failed:", e.message);
        }
      }
    }

    res.json({ success: true, message: "CV Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   ✅ REPLY TO CV — Admin Sends Email To Candidate
============================================================ */
export const replyToCV = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV Application Not Found",
      });
    }

    /* ✅ Send Reply Email */
    await sendCVReplyEmail({
      to: cv.email,
      userName: cv.fullName,
      replyMessage: replyMessage.trim(),
      originalMessage: cv.message || "",
      position: cv.position || "",
    });

    /* ✅ Save Reply + Update Status */
    cv.replyMessage = replyMessage.trim();
    cv.repliedAt = new Date();
    cv.status = "replied";
    await cv.save();

    res.json({
      success: true,
      message: "Reply Sent Successfully",
      cv,
    });
  } catch (err) {
    console.error("Reply To CV Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};