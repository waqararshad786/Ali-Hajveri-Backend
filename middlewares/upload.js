// backend/middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

/* ============================================================
   MULTER STORAGE — CV Files Save Karne Ke Liye
============================================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "cvs");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `cv-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX Files Are Allowed"), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});