/* ============================================================
   API ENDPOINTS — Central Configuration
============================================================ */
export const API_ENDPOINTS = {
  AUTH: {
    SEED: "/auth/seed",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    REGISTER: "/auth/register",
    UPDATE_PROFILE: "/auth/profile",
    UPDATE_PASSWORD: "/auth/password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_TOKEN: (token) => `/auth/verify-reset-token/${token}`,
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  },

  JOBS: {
    LIST: "/jobs",
    GET: (id) => `/jobs/${id}`,
    CREATE: "/jobs",
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`,
    SEED: "/jobs/seed",
  },

  APPLICATIONS: {
    SUBMIT: "/applications",
    LIST: "/applications",
    UPDATE: (id) => `/applications/${id}`,
    DELETE: (id) => `/applications/${id}`,
    FILE: (id) => `/applications/${id}/file`,
    /* ✅ NAYA — Reply To Applicant */
    REPLY: (id) => `/applications/${id}/reply`,
  },

  CONTACT: {
    SUBMIT: "/contact",
    LIST: "/contact",
    UPDATE: (id) => `/contact/${id}`,
    DELETE: (id) => `/contact/${id}`,
    /* ✅ Reply To Contact */
    REPLY: (id) => `/contact/${id}/reply`,
  },

  CV: {
    SUBMIT: "/cv",
    LIST: "/cv",
    UPDATE: (id) => `/cv/${id}`,
    DELETE: (id) => `/cv/${id}`,
    FILE: (id) => `/cv/${id}/file`,
    /* ✅ NAYA — Reply To CV Applicant */
    REPLY: (id) => `/cv/${id}/reply`,
  },
};