// backend/controllers/contactController.js
import Contact from "../models/Contact.js";
import {
  sendContactEmail,
  sendContactAcknowledgmentEmail,
  sendAdminReplyEmail,
} from "../utilis/email.js";

/* ============================================================
   SUBMIT CONTACT — Public Route (WITH EMAIL)
============================================================ */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });

    /* ============================================================
       📧 SEND EMAILS (After DB save — errors non-blocking)
       ============================================================ */

    // 1️⃣ Acknowledgment email to user
    try {
      await sendContactAcknowledgmentEmail({
        to: contact.email,
        name: contact.name,
      });
    } catch (emailError) {
      console.error("⚠️ User contact acknowledgment failed:", emailError);
    }

    // 2️⃣ Notification email to admin
    try {
      await sendContactEmail({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
      });
    } catch (emailError) {
      console.error("⚠️ Admin contact notification failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      contactId: contact._id,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET ALL CONTACTS — Admin Only
============================================================ */
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   UPDATE CONTACT STATUS — Admin Only
============================================================ */
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact Not Found" });
    }
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   REPLY TO CONTACT — Admin Sends Reply Via SendGrid
============================================================ */
export const replyToContact = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply Message Is Required",
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact Not Found" });
    }

    /* ============================================================
       📧 SEND REPLY EMAIL TO USER (Via SendGrid)
       ============================================================ */
    let emailSent = false;
    try {
      const result = await sendAdminReplyEmail({
        to: contact.email,
        userName: contact.name,
        subject: `Reply From Ali Hajveri International — ${contact.subject || "Your Message"}`,
        replyMessage: replyMessage.trim(),
        originalMessage: contact.message,
      });
      emailSent = result.success;
    } catch (emailError) {
      console.error("⚠️ Reply email failed:", emailError);
    }

    /* ✅ Save Reply In Database */
    contact.status = "replied";
    contact.replyMessage = replyMessage.trim();
    contact.repliedAt = new Date();
    await contact.save();

    res.json({
      success: true,
      message: emailSent
        ? "Reply Sent Successfully"
        : "Reply Saved (Email Failed — Check Logs)",
      emailSent,
      contact,
    });
  } catch (error) {
    console.error("Reply Error:", error);
    next(error);
  }
};

/* ============================================================
   DELETE CONTACT — Admin Only
============================================================ */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact Not Found" });
    }
    res.json({ success: true, message: "Contact Deleted" });
  } catch (error) {
    next(error);
  }
};