// backend/routes/application.js
import express from "express";
import {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationFile,
  replyToApplication,  // ✅ ADD KARO
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/auth.js";
import { validateApplication } from "../middlewares/validation.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* File Upload Middleware */
router.post(
  "/",
  upload.single("cvFile"),
  validateApplication,
  submitApplication
);

router.get("/", protect, getAllApplications);

/* FILE ROUTE */
router.get("/:id/file", protect, getApplicationFile);

router.put("/:id", protect, updateApplicationStatus);

/* ✅ REPLY ROUTE — MUST BE BEFORE /:id (DELETE) */
router.post("/:id/reply", protect, replyToApplication);

router.delete("/:id", protect, deleteApplication);

export default router;