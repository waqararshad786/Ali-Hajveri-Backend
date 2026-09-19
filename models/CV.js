// backend/models/CV.js
import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    passport: { type: String, default: "" },
    skills: { type: String, default: "" },
    message: { type: String, default: "" },

    /* ============================================================
       FILE FIELDS — CV UPLOAD
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

export default mongoose.model("CV", cvSchema);