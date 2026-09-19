// backend/routes/cvRoutes.js
import express from "express";
import {
  submitCV,
  getAllCVs,
  getCVFile,
  updateCVStatus,
  deleteCV,
} from "../controllers/cvController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ============================================================
   ROUTES
============================================================ */

// Submit CV — Public (Candidate Form)
router.post("/", upload.single("cvFile"), submitCV);

// Get All CVs — Admin Only
router.get("/", protect, getAllCVs);

/* ============================================================
   ✅ CV FILE ROUTE
   — Header Or Query Token Dono Accept Karta Hai
   — Kyunke Browser New Tab Me Header Nahi Bhejta
============================================================ */
router.get("/:id/file", getCVFile);

// Update Status — Admin Only
router.put("/:id", protect, updateCVStatus);

// Delete — Admin Only
router.delete("/:id", protect, deleteCV);

export default router;