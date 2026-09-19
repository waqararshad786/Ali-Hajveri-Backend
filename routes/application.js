// backend/routes/application.js
import express from "express";
import {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/auth.js";
import { validateApplication } from "../middlewares/validation.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ✅ File Upload Middleware — Field Name `cvFile` */
router.post(
  "/",
  upload.single("cvFile"),
  validateApplication,
  submitApplication
);

router.get("/", protect, getAllApplications);
router.put("/:id", protect, updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);

export default router;