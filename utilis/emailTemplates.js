// backend/utilis/emailTemplates.js

/* ============================================================
   COMPANY INFO
============================================================ */
const COMPANY = {
  name: "Ali Hajveri International (Pvt.) Ltd.",
  license: "OP&HRD/5224/LHR/2026",
  website: "www.alihajveri.com",
  email: "waqar000arshad@gmail.com",
  phone: "+92 300 1234567",
  address:
    "Office No. 1, 2nd Floor, Hajveri Plaza, Main Rajbah Road, Near Quaid-E-Azam Interchange, Dera Gujran, Lahore, Pakistan",
};

/* ============================================================
   EMAIL WRAPPER — Common Header + Footer
============================================================ */
const wrapEmail = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ali Hajveri International</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F0F7FA;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0F7FA;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,76,92,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                Ali Hajveri <span style="color:#4FC3F7;">International</span>
              </h1>
              <p style="margin:6px 0 0;color:#4FC3F7;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                Overseas Employment Promoter
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;color:#0A3A47;font-size:14px;line-height:1.7;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background:#F0F7FA;padding:24px;text-align:center;border-top:1px solid #E1F5FE;">
              <p style="margin:0 0 8px;color:#0F4C5C;font-size:12px;font-weight:700;">
                ${COMPANY.name}
              </p>
              <p style="margin:0 0 4px;color:#64748b;font-size:11px;">
                License # ${COMPANY.license}
              </p>
              <p style="margin:8px 0 0;color:#64748b;font-size:11px;">
                📧 ${COMPANY.email} &nbsp;|&nbsp; 📞 ${COMPANY.phone} &nbsp;|&nbsp; 🌐 ${COMPANY.website}
              </p>
              <p style="margin:16px 0 0;color:#94a3b8;font-size:10px;">
                © ${new Date().getFullYear()} Ali Hajveri International (Pvt.) Ltd. All Rights Reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const successIcon = `
<div style="text-align:center;margin-bottom:24px;">
  <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#4FC3F7 0%,#29B6F6 100%);box-shadow:0 12px 30px rgba(79,195,247,0.4);">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>
`;

/* ============================================================
   1. PASSWORD RESET TEMPLATE
============================================================ */
export const resetPasswordTemplate = (resetUrl, username) => {
  const content = `
    <h2 style="margin:0 0 16px;text-align:center;color:#0F4C5C;font-size:22px;font-weight:800;">
      🔐 Password Reset Request
    </h2>
    <p style="margin:0 0 16px;">Hi <strong>${username}</strong>,</p>
    <p style="margin:0 0 16px;">We Received A Request To Reset Your Admin Password. Click The Button Below To Set A New Password.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4FC3F7,#29B6F6);color:#0F4C5C;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:800;font-size:14px;box-shadow:0 12px 30px rgba(79,195,247,0.4);">
        Reset Password
      </a>
    </div>
    <p style="margin:16px 0 0;color:#64748b;font-size:12px;text-align:center;">Or Copy This Link: <br><span style="color:#4FC3F7;word-break:break-all;">${resetUrl}</span></p>
    <p style="margin:20px 0 0;color:#64748b;font-size:12px;">⏰ This Link Will Expire In <strong>30 Minutes</strong>. If You Didn't Request This, Ignore This Email.</p>
  `;
  return wrapEmail(content);
};

/* ============================================================
   2. APPLICATION CONFIRMATION TEMPLATE (User Ko)
============================================================ */
export const applicationConfirmationTemplate = ({
  name,
  jobTitle,
  company,
  location,
}) => {
  const content = `
    ${successIcon}
    <h2 style="margin:0 0 8px;text-align:center;color:#0F4C5C;font-size:24px;font-weight:800;">
      Application Submitted!
    </h2>
    <p style="margin:0 0 24px;text-align:center;color:#64748b;font-size:13px;">
      Your Application Has Been Successfully Received
    </p>
    <p style="margin:0 0 16px;">Dear <strong style="color:#0F4C5C;">${name}</strong>,</p>
    <p style="margin:0 0 16px;">
      Thank You For Your Interest In The Following Position. Your Application Has Been Successfully Received By Our Team.
    </p>
    <div style="background:linear-gradient(135deg,#0F4C5C 0%,#0A3A47 100%);border-radius:12px;padding:20px 24px;margin:20px 0;color:#ffffff;">
      <p style="margin:0 0 6px;color:#4FC3F7;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Position Applied For</p>
      <p style="margin:0 0 12px;font-size:18px;font-weight:800;">${jobTitle}</p>
      ${company ? `<p style="margin:0 0 4px;font-size:13px;color:#E1F5FE;">🏢 ${company}</p>` : ""}
      ${location ? `<p style="margin:0;font-size:13px;color:#E1F5FE;">📍 ${location}</p>` : ""}
    </div>
    <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 8px;color:#0F4C5C;font-weight:700;font-size:13px;">📅 What Happens Next?</p>
      <ul style="margin:0;padding-left:20px;color:#0A3A47;font-size:13px;line-height:1.9;">
        <li>Our Team Will Review Your Application</li>
        <li>Shortlisted Candidates Will Be Contacted For Interview</li>
        <li>You Will Hear From Us Within <strong>3–4 Working Days</strong></li>
        <li>Please Keep Your Phone And Email Accessible</li>
      </ul>
    </div>
    <p style="margin:24px 0 0;color:#0F4C5C;font-weight:600;">
      Best Regards,<br>
      <span style="color:#4FC3F7;">Recruitment Team</span><br>
      Ali Hajveri International (Pvt.) Ltd.
    </p>
  `;
  return {
    subject: `✅ Application Received — ${jobTitle}`,
    html: wrapEmail(content),
  };
};

/* ============================================================
   3. CV CONFIRMATION TEMPLATE (User Ko)
============================================================ */
export const cvConfirmationTemplate = ({ name }) => {
  const content = `
    ${successIcon}
    <h2 style="margin:0 0 8px;text-align:center;color:#0F4C5C;font-size:24px;font-weight:800;">
      CV Submitted Successfully!
    </h2>
    <p style="margin:0 0 24px;text-align:center;color:#64748b;font-size:13px;">
      Thank You For Submitting Your CV To Ali Hajveri International
    </p>
    <p style="margin:0 0 16px;">Dear <strong style="color:#0F4C5C;">${name}</strong>,</p>
    <p style="margin:0 0 16px;">
      We Are Pleased To Inform You That Your CV Has Been Successfully Received By Our Recruitment Team. Your Profile Is Now Under Review For Suitable Overseas Employment Opportunities.
    </p>
    <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 8px;color:#0F4C5C;font-weight:700;font-size:13px;">📅 What Happens Next?</p>
      <ul style="margin:0;padding-left:20px;color:#0A3A47;font-size:13px;line-height:1.9;">
        <li>Our Team Will Review Your Profile In Detail</li>
        <li>We Will Match Your Qualifications With Available Opportunities</li>
        <li>If A Suitable Position Is Found, We Will Contact You Within <strong>3–4 Working Days</strong></li>
        <li>You May Also Be Contacted For An Interview Or Trade Test</li>
      </ul>
    </div>
    <p style="margin:16px 0 0;color:#64748b;font-size:13px;">
      Please Keep Your Phone And Email Accessible. If You Have Any Questions, Feel Free To Reach Out.
    </p>
    <p style="margin:24px 0 0;color:#0F4C5C;font-weight:600;">
      Best Regards,<br>
      <span style="color:#4FC3F7;">Recruitment Team</span><br>
      Ali Hajveri International (Pvt.) Ltd.
    </p>
  `;
  return {
    subject: "✅ Your CV Has Been Received — Ali Hajveri International",
    html: wrapEmail(content),
  };
};

/* ============================================================
   4. CONTACT ACKNOWLEDGMENT TEMPLATE (User Ko)
============================================================ */
export const contactAcknowledgmentTemplate = ({ name }) => {
  const content = `
    ${successIcon}
    <h2 style="margin:0 0 8px;text-align:center;color:#0F4C5C;font-size:24px;font-weight:800;">
      Thank You For Contacting Us!
    </h2>
    <p style="margin:0 0 24px;text-align:center;color:#64748b;font-size:13px;">
      Your Message Has Been Received
    </p>
    <p style="margin:0 0 16px;">Dear <strong style="color:#0F4C5C;">${name}</strong>,</p>
    <p style="margin:0 0 16px;">
      Thank You For Reaching Out To Ali Hajveri International. We Have Received Your Message And Our Team Is Currently Reviewing It.
    </p>
    <div style="background:#E1F5FE;border-left:4px solid #4FC3F7;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0;color:#0A3A47;font-size:13px;">
        📞 Our Team Will Get Back To You Within <strong>3–4 Working Days</strong>. If Your Matter Is Urgent, Please Call Us Directly At <strong>${COMPANY.phone}</strong>.
      </p>
    </div>
    <p style="margin:24px 0 0;color:#0F4C5C;font-weight:600;">
      Best Regards,<br>
      <span style="color:#4FC3F7;">Customer Support Team</span><br>
      Ali Hajveri International (Pvt.) Ltd.
    </p>
  `;
  return {
    subject: "✅ We've Received Your Message — Ali Hajveri International",
    html: wrapEmail(content),
  };
};

/* ============================================================
   LEGACY EXPORTS — Purane Naam Bhi Kaam Karenge
   (Agar Kahin Purane Function Names Use Ho Rahe Hain)
============================================================ */

/* Purana Naam: applicationEmailTemplate — Admin Notification */
export const applicationEmailTemplate = (application) => {
  return `
    <div style="font-family:sans-serif;background:#F0F7FA;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;">
        <h2 style="color:#0F4C5C;">🎯 New Job Application</h2>
        <p><strong>Job:</strong> ${application.jobTitle}</p>
        <p><strong>Company:</strong> ${application.company}</p>
        <p><strong>Applicant:</strong> ${application.fullName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Country:</strong> ${application.country}</p>
        <p><strong>Experience:</strong> ${application.experience}</p>
        <p><strong>Education:</strong> ${application.education}</p>
        <p><strong>Skills:</strong> ${application.skills || "—"}</p>
        <p><strong>Message:</strong> ${application.message || "—"}</p>
      </div>
    </div>
  `;
};

/* Purana Naam: contactEmailTemplate — Admin Notification */
export const contactEmailTemplate = (contact) => {
  return `
    <div style="font-family:sans-serif;background:#F0F7FA;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;">
        <h2 style="color:#0F4C5C;">📩 New Contact Message</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || "—"}</p>
        <p><strong>Subject:</strong> ${contact.subject || "—"}</p>
        <p><strong>Message:</strong></p>
        <p style="background:#E1F5FE;padding:12px;border-radius:8px;">${contact.message}</p>
      </div>
    </div>
  `;
};

export { COMPANY };