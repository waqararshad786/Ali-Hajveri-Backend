// backend/routes/cvRoutes.js
import express from "express";
import {
  submitCV,
  getAllCVs,
  getCVFile,
  updateCVStatus,
  deleteCV,
  replyToCV,                    // ✅ ADD
} from "../controllers/cvController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Submit CV — Public
router.post("/", upload.single("cvFile"), submitCV);

// Get All CVs — Admin
router.get("/", protect, getAllCVs);

// CV File — Header or Query Token
router.get("/:id/file", getCVFile);

/* ✅ REPLY ROUTE — Admin Sends Email To Candidate */
router.post("/:id/reply", protect, replyToCV);

// Update Status — Admin
router.put("/:id", protect, updateCVStatus);

// Delete — Admin
router.delete("/:id", protect, deleteCV);

export default router;