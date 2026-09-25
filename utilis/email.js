// backend/utilis/email.js
import transporter from "../config/nodemailer.js";
import {
  applicationConfirmationTemplate,
  cvConfirmationTemplate,
  contactAcknowledgmentTemplate,
} from "./emailTemplates.js";

const FROM =
  process.env.EMAIL_FROM ||
  "Ali Hajveri International <waqar000arshad@gmail.com>";

/* ============================================================
   BASE SEND FUNCTION
============================================================ */
const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_USER,
    });
    console.log(`✅ Email Sent To: ${to} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email Failed To: ${to}`, error.message);
    return { success: false, error: error.message };
  }
};

/* ============================================================
   SHARED REPLY TEMPLATE
============================================================ */
const buildReplyHtml = ({
  userName,
  replyTitle,
  replyMessage,
  originalMessage,
  originalLabel = "Your Original Message",
}) => `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F0F7FA;padding:24px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,76,92,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);padding:28px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">
            📬 ${replyTitle}
          </h1>
          <p style="margin:6px 0 0;color:#4FC3F7;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
            Ali Hajveri International
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px;color:#0A3A47;font-size:14px;line-height:1.7;">
          <p style="margin:0 0 16px;">Dear <strong style="color:#0F4C5C;">${userName}</strong>,</p>

          <p style="margin:0 0 20px;">
            Thank You For Reaching Out To Us. Our Team Has Reviewed Your Message And Here Is Our Response:
          </p>

          <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:18px 20px;margin:20px 0;">
            <p style="margin:0;color:#0A3A47;font-size:14px;line-height:1.7;white-space:pre-wrap;">${replyMessage}</p>
          </div>

          ${
            originalMessage
              ? `
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #E1F5FE;">
              <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                ${originalLabel}:
              </p>
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;font-style:italic;background:#F8FAFC;padding:12px 16px;border-radius:8px;white-space:pre-wrap;">
                ${originalMessage}
              </p>
            </div>
          `
              : ""
          }

          <p style="margin:28px 0 0;color:#0F4C5C;font-weight:600;">
            Best Regards,<br>
            <span style="color:#4FC3F7;">Recruitment Team</span><br>
            Ali Hajveri International (Pvt.) Ltd.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#F0F7FA;padding:20px;text-align:center;border-top:1px solid #E1F5FE;">
          <p style="margin:0 0 6px;color:#0F4C5C;font-size:12px;font-weight:700;">
            Ali Hajveri International (Pvt.) Ltd.
          </p>
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;">
            License # OP&HRD/5224/LHR/2026
          </p>
          <p style="margin:8px 0 0;color:#64748b;font-size:11px;">
            📧 ${process.env.EMAIL_USER} &nbsp;|&nbsp; 📞 +92 300 1234567 &nbsp;|&nbsp; 🌐 www.alihajveri.com
          </p>
        </td>
      </tr>
    </table>
  </div>
`;

/* ============================================================
   1. APPLICATION EMAIL — Admin Notification
============================================================ */
export const sendApplicationEmail = async (application) => {
  try {
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F0F7FA;padding:24px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,76,92,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);padding:28px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">🎯 New Job Application</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#0A3A47;font-size:14px;line-height:1.7;">
              <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <p style="margin:0 0 6px;color:#0F4C5C;font-size:11px;font-weight:700;text-transform:uppercase;">Position</p>
                <p style="margin:0 0 6px;font-size:16px;font-weight:800;">${application.jobTitle}</p>
                <p style="margin:0;font-size:13px;color:#64748b;">at ${application.company}</p>
              </div>
              <h3 style="margin:0 0 12px;color:#0F4C5C;font-size:14px;font-weight:700;">👤 Applicant Details</h3>
              <table cellspacing="0" cellpadding="0" style="width:100%;font-size:13px;">
                <tr><td style="padding:6px 0;color:#64748b;width:120px;">Full Name</td><td style="padding:6px 0;font-weight:600;">${application.fullName}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;font-weight:600;">${application.email}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;font-weight:600;">${application.phone}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Country</td><td style="padding:6px 0;font-weight:600;">${application.country}${application.city ? ", " + application.city : ""}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Experience</td><td style="padding:6px 0;font-weight:600;">${application.experience}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Education</td><td style="padding:6px 0;font-weight:600;">${application.education}</td></tr>
                ${application.skills ? `<tr><td style="padding:6px 0;color:#64748b;">Skills</td><td style="padding:6px 0;font-weight:600;">${application.skills}</td></tr>` : ""}
              </table>
              ${application.message ? `<h3 style="margin:20px 0 8px;color:#0F4C5C;font-size:14px;font-weight:700;">💬 Message</h3><p style="margin:0;background:#E1F5FE;padding:14px;border-radius:8px;font-size:13px;line-height:1.6;">${application.message}</p>` : ""}
              ${application.fileName ? `<h3 style="margin:20px 0 8px;color:#0F4C5C;font-size:14px;font-weight:700;">📎 CV File</h3><p style="margin:0;font-size:13px;font-weight:600;">${application.fileName}</p>` : ""}
              <div style="text-align:center;margin-top:28px;">
                <a href="${process.env.CLIENT_URL}/admin/job-applications" style="display:inline-block;background:linear-gradient(135deg,#4FC3F7,#29B6F6);color:#0F4C5C;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:800;font-size:13px;">View In Admin Panel</a>
              </div>
            </td>
          </tr>
          <tr><td style="background:#F0F7FA;padding:16px;text-align:center;"><p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Ali Hajveri International (Pvt.) Ltd.</p></td></tr>
        </table>
      </div>
    `;
    return sendEmail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `🎯 New Application — ${application.jobTitle}`,
      html,
    });
  } catch (error) {
    console.error("Application notification email failed:", error);
    return { success: false };
  }
};

/* ============================================================
   2. APPLICATION CONFIRMATION — User Ko
============================================================ */
export const sendApplicationConfirmationEmail = async (application) => {
  const { subject, html } = applicationConfirmationTemplate({
    name: application.fullName,
    jobTitle: application.jobTitle,
    company: application.company,
    location: application.country,
  });
  return sendEmail({ to: application.email, subject, html });
};

/* ============================================================
   3. CV CONFIRMATION — User Ko
============================================================ */
export const sendCVConfirmationEmail = async ({ to, name }) => {
  const { subject, html } = cvConfirmationTemplate({ name });
  return sendEmail({ to, subject, html });
};

/* ============================================================
   4. CONTACT EMAIL — Admin Notification
============================================================ */
export const sendContactEmail = async (contact) => {
  try {
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F0F7FA;padding:24px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,76,92,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);padding:28px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">📩 New Contact Message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#0A3A47;font-size:14px;line-height:1.7;">
              <table cellspacing="0" cellpadding="0" style="width:100%;font-size:13px;">
                <tr><td style="padding:6px 0;color:#64748b;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${contact.name}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;font-weight:600;">${contact.email}</td></tr>
                ${contact.phone ? `<tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;font-weight:600;">${contact.phone}</td></tr>` : ""}
                ${contact.subject ? `<tr><td style="padding:6px 0;color:#64748b;">Subject</td><td style="padding:6px 0;font-weight:600;">${contact.subject}</td></tr>` : ""}
              </table>
              <h3 style="margin:20px 0 8px;color:#0F4C5C;font-size:14px;font-weight:700;">💬 Message</h3>
              <p style="margin:0;background:#E1F5FE;padding:14px;border-radius:8px;font-size:13px;line-height:1.6;white-space:pre-wrap;">${contact.message}</p>
              <div style="text-align:center;margin-top:28px;">
                <a href="${process.env.CLIENT_URL}/admin/messages" style="display:inline-block;background:linear-gradient(135deg,#4FC3F7,#29B6F6);color:#0F4C5C;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:800;font-size:13px;">View In Admin Panel</a>
              </div>
            </td>
          </tr>
          <tr><td style="background:#F0F7FA;padding:16px;text-align:center;"><p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Ali Hajveri International (Pvt.) Ltd.</p></td></tr>
        </table>
      </div>
    `;
    return sendEmail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `📩 New Contact Message — ${contact.name}`,
      html,
      replyTo: contact.email,
    });
  } catch (error) {
    console.error("Contact notification email failed:", error);
    return { success: false };
  }
};

/* ============================================================
   5. CONTACT ACKNOWLEDGMENT — User Ko
============================================================ */
export const sendContactAcknowledgmentEmail = async ({ to, name }) => {
  const { subject, html } = contactAcknowledgmentTemplate({ name });
  return sendEmail({ to, subject, html });
};

/* ============================================================
   6. ✅ ADMIN REPLY TO CONTACT — From Panel
============================================================ */
export const sendAdminReplyEmail = async ({
  to,
  userName,
  subject,
  replyMessage,
  originalMessage,
}) => {
  const html = buildReplyHtml({
    userName,
    replyTitle: "Reply From Ali Hajveri International",
    replyMessage,
    originalMessage,
    originalLabel: "Your Original Message",
  });

  return sendEmail({
    to,
    subject: subject || "Reply From Ali Hajveri International",
    html,
  });
};

/* ============================================================
   7. ✅ ADMIN REPLY TO APPLICATION — Careers Page Applicants
============================================================ */
export const sendApplicationReplyEmail = async ({
  to,
  userName,
  subject,
  replyMessage,
  originalMessage,
  jobTitle,
}) => {
  const html = buildReplyHtml({
    userName,
    replyTitle: `Reply Regarding Your Application${
      jobTitle ? ` — ${jobTitle}` : ""
    }`,
    replyMessage,
    originalMessage,
    originalLabel: "Your Original Application Message",
  });

  return sendEmail({
    to,
    subject:
      subject ||
      `Reply Regarding Your Application${jobTitle ? ` — ${jobTitle}` : ""}`,
    html,
  });
};

/* ============================================================
   8. ✅ ADMIN REPLY TO CV — Submit CV Applicants
============================================================ */
export const sendCVReplyEmail = async ({
  to,
  userName,
  subject,
  replyMessage,
  originalMessage,
  position,
}) => {
  const html = buildReplyHtml({
    userName,
    replyTitle: `Reply Regarding Your CV${
      position ? ` — ${position}` : ""
    }`,
    replyMessage,
    originalMessage,
    originalLabel: "Your Original CV Message",
  });

  return sendEmail({
    to,
    subject:
      subject ||
      `Reply Regarding Your CV${position ? ` — ${position}` : ""}`,
    html,
  });
};

export default sendEmail;