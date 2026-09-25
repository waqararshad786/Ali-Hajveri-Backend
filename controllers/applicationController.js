// backend/controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  sendApplicationEmail,
  sendApplicationConfirmationEmail,
  sendApplicationReplyEmail,        // ✅ ADD
} from "../utilis/email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================================================
   SUBMIT APPLICATION
============================================================ */
export const submitApplication = async (req, res, next) => {
  try {
    const {
      jobId, fullName, email, phone, country, city,
      experience, education, skills, message,
    } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job Not Found" });
    }

    const application = await Application.create({
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      fullName, email, phone, country,
      city: city || "",
      experience, education,
      skills: skills || "",
      message: message || "",

      fileName: req.file?.originalname || "",
      filePath: req.file?.path || "",
      fileUrl: req.file?.path
        ? `/${req.file.path.replace(/\\/g, "/")}`
        : "",
      fileSize: req.file?.size || 0,
      mimeType: req.file?.mimetype || "",
    });

    sendApplicationEmail(application).catch((err) =>
      console.error("Admin Email Failed:", err)
    );

    sendApplicationConfirmationEmail(application).catch((err) =>
      console.error("User Confirmation Email Failed:", err)
    );

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      applicationId: application._id,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET ALL APPLICATIONS
============================================================ */
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET APPLICATION FILE (View / Download)
============================================================ */
export const getApplicationFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { download } = req.query;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const filePath =
      application.filePath ||
      application.cvFilePath ||
      application.cvFile;

    const fileName =
      application.fileName ||
      application.cvFileName ||
      "resume.pdf";

    const mimeType =
      application.mimeType ||
      application.cvMimeType ||
      "application/pdf";

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "No file attached to this application",
      });
    }

    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, "..", filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    if (download === "1") {
      return res.download(absolutePath, fileName);
    }

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(fileName)}"`
    );
    return res.sendFile(absolutePath);
  } catch (err) {
    console.error("❌ File Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch file",
    });
  }
};

/* ============================================================
   UPDATE STATUS
============================================================ */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "reviewed", "shortlisted", "rejected", "replied", "pending"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application Not Found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   DELETE APPLICATION
============================================================ */
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application Not Found" });
    }
    res.json({ success: true, message: "Application Deleted" });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   ✅ REPLY TO APPLICATION — Admin Sends Email To Candidate
============================================================ */
export const replyToApplication = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found",
      });
    }

    /* ✅ Send Reply Email */
    await sendApplicationReplyEmail({
      to: application.email,
      userName: application.fullName,
      replyMessage: replyMessage.trim(),
      originalMessage: application.message || "",
      jobTitle: application.jobTitle || application.position || "",
    });

    /* ✅ Save Reply + Update Status */
    application.replyMessage = replyMessage.trim();
    application.repliedAt = new Date();
    application.status = "replied";
    await application.save();

    res.json({
      success: true,
      message: "Reply Sent Successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};