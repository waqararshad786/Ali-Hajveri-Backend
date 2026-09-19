import express from "express";
import {
  getAllJobs, getJobById, createJob,
  updateJob, deleteJob, seedJobs,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/auth.js";
import { validateJob } from "../middlewares/validation.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/seed", protect, seedJobs);
router.get("/:id", getJobById);
router.post("/", protect, validateJob, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;