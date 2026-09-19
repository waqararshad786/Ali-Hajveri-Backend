import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Contract", "Temporary"],
      default: "Full Time",
    },
    category: {
      type: String,
      enum: ["Technical", "Professional", "General", "Semi-Skilled"],
      default: "Technical",
    },
    salary: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    posted: { type: String, default: "Just now" },
    urgent: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    description: { type: String, default: "" },
    requirements: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);