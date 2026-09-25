// backend/middlewares/auth.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token;

    /* ✅ 1. Header Se Token (Normal API Calls) */
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    /* ✅ 2. Query Param Se Token (File Download / View Ke Liye) */
    else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};