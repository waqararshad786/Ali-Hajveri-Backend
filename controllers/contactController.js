// backend/controllers/contactController.js
import Contact from "../models/Contact.js";
import {
  sendContactEmail,
  sendContactAcknowledgmentEmail,
  sendAdminReplyEmail,
} from "../utilis/email.js";

/* ============================================================
   SUBMIT CONTACT — Public Route
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

    /* Admin Notification */
    sendContactEmail(contact).catch((err) =>
      console.error("Admin Contact Notification Failed:", err)
    );

    /* User Acknowledgment */
    sendContactAcknowledgmentEmail({
      to: contact.email,
      name: contact.name,
    }).catch((err) =>
      console.error("User Acknowledgment Email Failed:", err)
    );

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
   ✅ REPLY TO CONTACT — Admin Sends Reply
   — Admin Panel Se User Ko Direct Email
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

    /* ✅ Send Email */
    const result = await sendAdminReplyEmail({
      to: contact.email,
      userName: contact.name,
      subject: `Re: ${contact.subject || "Your Inquiry"} — Ali Hajveri International`,
      replyMessage: replyMessage.trim(),
      originalMessage: contact.message,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Failed To Send Email. Please Try Again.",
      });
    }

    /* ✅ Update Contact */
    contact.status = "replied";
    contact.replyMessage = replyMessage.trim();
    contact.repliedAt = new Date();
    await contact.save();

    res.json({
      success: true,
      message: "Reply Sent Successfully",
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