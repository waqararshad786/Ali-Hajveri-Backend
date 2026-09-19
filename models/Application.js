// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, default: "" },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    skills: { type: String, default: "" },
    message: { type: String, default: "" },

    /* ============================================================
       ✅ FILE FIELDS — CV UPLOAD
    ============================================================ */
    fileName: { type: String, default: "" },
    filePath: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: "" },

    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);