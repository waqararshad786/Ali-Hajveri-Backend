// backend/controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import {
  sendApplicationEmail,
  sendApplicationConfirmationEmail,
} from "../utilis/email.js";

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

    /* ✅ FILE FIELDS */
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

    /* ✅ Admin Notification (existing) */
    sendApplicationEmail(application).catch((err) =>
      console.error("Admin Email Failed:", err)
    );

    /* ✅ User Confirmation (new) */
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
   UPDATE STATUS
============================================================ */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "reviewed", "shortlisted", "rejected"];

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