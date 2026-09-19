// backend/routes/contactRoutes.js
import express from "express";
import {
  submitContact,
  getContacts,
  updateContactStatus,
  replyToContact,
  deleteContact,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/* Public */
router.post("/", submitContact);

/* Admin Only */
router.get("/", protect, getContacts);
router.put("/:id", protect, updateContactStatus);

/* ✅ Reply Route — MUST Be Before /:id */
router.post("/:id/reply", protect, replyToContact);

router.delete("/:id", protect, deleteContact);

export default router;