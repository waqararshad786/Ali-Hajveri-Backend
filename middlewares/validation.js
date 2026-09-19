import { body, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

export const validateLogin = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

export const validateJob = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("salary").trim().notEmpty().withMessage("Salary is required"),
  body("experience").trim().notEmpty().withMessage("Experience is required"),
  body("education").trim().notEmpty().withMessage("Education is required"),
  handleValidation,
];

export const validateApplication = [
  body("jobId").notEmpty().withMessage("Job ID is required"),
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("experience").trim().notEmpty().withMessage("Experience is required"),
  body("education").trim().notEmpty().withMessage("Education is required"),
  handleValidation,
];

export const validateContact = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  handleValidation,
];