// backend/controllers/cvController.js
import CV from "../models/CV.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import sendEmail, {
  sendCVConfirmationEmail,
  sendCVReplyEmail,
} from "../utilis/email.js";

/* ============================================================
   SUBMIT CV — Public Route (WITH EMAIL)
============================================================ */
export const submitCV = async (req, res) => {
  try {
    const cv = new CV({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp,
      city: req.body.city,
      country: req.body.country,
      position: req.body.position,
      category: req.body.category,
      experience: req.body.experience,
      education: req.body.education,
      passport: req.body.passport,
      skills: req.body.skills,
      message: req.body.message,

      fileName: req.file?.originalname || "",
      filePath: req.file?.path || "",
      fileUrl: req.file?.path ? `/${req.file.path.replace(/\\/g, "/")}` : "",
      fileSize: req.file?.size || 0,
      mimeType: req.file?.mimetype || "",
    });

    await cv.save();

    /* ============================================================
       📧 SEND EMAILS (After DB save — errors non-blocking)
       ============================================================ */

    // 1️⃣ Confirmation email to candidate
    try {
      await sendCVConfirmationEmail({
        to: cv.email,
        name: cv.fullName,
      });
    } catch (emailError) {
      console.error("⚠️ Candidate CV confirmation email failed:", emailError);
    }

    // 2️⃣ Notification email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL,
        subject: `📄 New CV Submission — ${cv.fullName}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F0F7FA;padding:24px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,76,92,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);padding:28px 24px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">📄 New CV Submitted</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;color:#0A3A47;font-size:14px;line-height:1.7;">
                  <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                    <p style="margin:0 0 6px;color:#0F4C5C;font-size:11px;font-weight:700;text-transform:uppercase;">Position Applied For</p>
                    <p style="margin:0;font-size:16px;font-weight:800;">${cv.position}</p>
                  </div>
                  <h3 style="margin:0 0 12px;color:#0F4C5C;font-size:14px;font-weight:700;">👤 Candidate Details</h3>
                  <table cellspacing="0" cellpadding="0" style="width:100%;font-size:13px;">
                    <tr><td style="padding:6px 0;color:#64748b;width:140px;">Full Name</td><td style="padding:6px 0;font-weight:600;">${cv.fullName}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;font-weight:600;">${cv.email}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;font-weight:600;">${cv.phone}</td></tr>
                    ${cv.whatsapp ? `<tr><td style="padding:6px 0;color:#64748b;">WhatsApp</td><td style="padding:6px 0;font-weight:600;">${cv.whatsapp}</td></tr>` : ""}
                    ${cv.city ? `<tr><td style="padding:6px 0;color:#64748b;">City</td><td style="padding:6px 0;font-weight:600;">${cv.city}</td></tr>` : ""}
                    <tr><td style="padding:6px 0;color:#64748b;">Country</td><td style="padding:6px 0;font-weight:600;">${cv.country}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;">Category</td><td style="padding:6px 0;font-weight:600;">${cv.category}</td></tr>
                    ${cv.experience ? `<tr><td style="padding:6px 0;color:#64748b;">Experience</td><td style="padding:6px 0;font-weight:600;">${cv.experience}</td></tr>` : ""}
                    ${cv.education ? `<tr><td style="padding:6px 0;color:#64748b;">Education</td><td style="padding:6px 0;font-weight:600;">${cv.education}</td></tr>` : ""}
                    ${cv.passport ? `<tr><td style="padding:6px 0;color:#64748b;">Passport</td><td style="padding:6px 0;font-weight:600;">${cv.passport}</td></tr>` : ""}
                    ${cv.skills ? `<tr><td style="padding:6px 0;color:#64748b;">Skills</td><td style="padding:6px 0;font-weight:600;">${cv.skills}</td></tr>` : ""}
                  </table>
                  ${cv.message ? `<h3 style="margin:20px 0 8px;color:#0F4C5C;font-size:14px;font-weight:700;">💬 Message</h3><p style="margin:0;background:#E1F5FE;padding:14px;border-radius:8px;font-size:13px;line-height:1.6;white-space:pre-wrap;">${cv.message}</p>` : ""}
                  ${cv.fileName ? `<h3 style="margin:20px 0 8px;color:#0F4C5C;font-size:14px;font-weight:700;">📎 CV File</h3><p style="margin:0;font-size:13px;font-weight:600;">${cv.fileName} (${(cv.fileSize / 1024).toFixed(1)} KB)</p>` : ""}
                  <div style="text-align:center;margin-top:28px;">
                    <a href="${process.env.CLIENT_URL}/admin/cvs" style="display:inline-block;background:linear-gradient(135deg,#4FC3F7,#29B6F6);color:#0F4C5C;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:800;font-size:13px;">View In Admin Panel</a>
                  </div>
                </td>
              </tr>
              <tr><td style="background:#F0F7FA;padding:16px;text-align:center;"><p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Ali Hajveri International (Pvt.) Ltd.</p></td></tr>
            </table>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("⚠️ Admin CV notification email failed:", emailError);
    }

    res.status(201).json({ success: true, cv });
  } catch (err) {
    console.error("CV Submit Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ALL CVs — Admin Only
============================================================ */
export const getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.find().sort({ createdAt: -1 });
    res.json({ success: true, cvs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET CV FILE — Open / Download
============================================================ */
export const getCVFile = async (req, res) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not Authorized. Token Missing." });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Or Expired Token" });
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV Not Found" });

    const filePath = cv.filePath || cv.fileUrl;
    if (!filePath) {
      return res.status(404).json({ message: "File Not Available" });
    }

    if (/^https?:\/\//i.test(filePath)) {
      return res.redirect(filePath);
    }

    let absolutePath = filePath;

    if (absolutePath.startsWith("/")) {
      absolutePath = absolutePath.substring(1);
    }

    if (!path.isAbsolute(absolutePath)) {
      absolutePath = path.join(process.cwd(), absolutePath);
    }

    if (!fs.existsSync(absolutePath)) {
      console.error("File Not Found On Disk:", absolutePath);
      return res.status(404).json({ message: "File Missing On Server" });
    }

    if (req.query.download === "1") {
      return res.download(absolutePath, cv.fileName || "cv.pdf");
    }

    res.setHeader("Content-Type", cv.mimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${cv.fileName || "cv.pdf"}"`
    );
    return res.sendFile(absolutePath);
  } catch (err) {
    console.error("CV File Error:", err);
    res.status(500).json({ message: "Failed To Serve File" });
  }
};

/* ============================================================
   UPDATE CV STATUS — Admin Only
============================================================ */
export const updateCVStatus = async (req, res) => {
  try {
    const cv = await CV.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );
    if (!cv) return res.status(404).json({ message: "CV Not Found" });
    res.json({ success: true, cv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   ✅ REPLY TO CV — Admin Sends Email Reply
============================================================ */
export const replyToCV = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply Message Is Required",
      });
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV Not Found",
      });
    }

    /* ============================================================
       📧 SEND REPLY EMAIL TO CANDIDATE
       ============================================================ */
    let emailSent = false;
    try {
      const result = await sendCVReplyEmail({
        to: cv.email,
        userName: cv.fullName,
        subject: `Reply Regarding Your CV — ${cv.position}`,
        replyMessage: replyMessage.trim(),
        originalMessage: cv.message,
        position: cv.position,
      });
      emailSent = result.success;
    } catch (emailError) {
      console.error("⚠️ CV reply email failed:", emailError);
    }

    /* ✅ Save Reply In Database */
    cv.status = "replied";
    cv.replyMessage = replyMessage.trim();
    cv.repliedAt = new Date();
    await cv.save();

    res.json({
      success: true,
      message: emailSent
        ? "Reply Sent Successfully"
        : "Reply Saved (Email Failed — Check Logs)",
      emailSent,
      cv,
    });
  } catch (error) {
    console.error("CV Reply Error:", error);
    next(error);
  }
};

/* ============================================================
   DELETE CV — Admin Only
============================================================ */
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findByIdAndDelete(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV Not Found" });

    if (cv.filePath) {
      let fileOnDisk = cv.filePath;
      if (fileOnDisk.startsWith("/")) fileOnDisk = fileOnDisk.substring(1);
      if (!path.isAbsolute(fileOnDisk)) {
        fileOnDisk = path.join(process.cwd(), fileOnDisk);
      }
      if (fs.existsSync(fileOnDisk)) {
        try {
          fs.unlinkSync(fileOnDisk);
        } catch (e) {
          console.warn("File Delete Failed:", e.message);
        }
      }
    }

    res.json({ success: true, message: "CV Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};