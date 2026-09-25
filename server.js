
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/auth.js";
// import jobRoutes from "./routes/jobs.js";
// import applicationRoutes from "./routes/application.js";
// import contactRoutes from "./routes/contactRoutes.js";
// import cvRoutes from "./routes/cvRoutes.js";

// import { errorHandler } from "./middlewares/errorHandler.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.use(cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "http://127.0.0.1:5173",
//       process.env.CLIENT_URL,
//     ].filter(Boolean),
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "AHIOEP Backend API is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend is running with MongoDB!",
//   });
// });

// app.get("/api/seed-now", async (req, res) => {
//   try {
//     const Admin = (await import("./models/Admin.js")).default;
//     const bcrypt = (await import("bcryptjs")).default;

//     const username = (
//       process.env.ADMIN_USERNAME || "admin"
//     )
//       .toLowerCase()
//       .trim();

//     const email = (
//       process.env.ADMIN_EMAIL || "admin@example.com"
//     )
//       .toLowerCase()
//       .trim();

//     const password =
//       process.env.ADMIN_PASSWORD || "admin123";

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await Admin.deleteMany({});

//     await Admin.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     res.json({
//       success: true,
//       message: "Admin created/reset successfully!",
//       username,
//       email,
//     });
//   } catch (error) {
//     console.error("Seed error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/applications", applicationRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/cv", cvRoutes);

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`,
//   });
// });

// app.use(errorHandler);

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/application.js";
import contactRoutes from "./routes/contactRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// =========================
// CORS
// =========================

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    // "https://ali-hajveri-frontend-ocnb.vercel.app/",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("❌ CORS blocked:", origin);
            return callback(new Error("Not allowed by CORS"));
        },
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
        credentials: true,
    })
);

app.options("*", cors());

// =========================
// BODY PARSER
// =========================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================
// UPLOADS
// =========================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AHIOEP Backend API is running",
        timestamp: new Date().toISOString(),
    });
});

// =========================
// TEST
// =========================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running with MongoDB!",
    });
});

// =========================
// SEED ADMIN
// =========================

app.get("/api/seed-now", async (req, res) => {
    try {
        const Admin = (await import("./models/Admin.js")).default;
        const bcrypt = (await import("bcryptjs")).default;

        const username = (
            process.env.ADMIN_USERNAME || "admin"
        )
            .toLowerCase()
            .trim();

        const email = (
            process.env.ADMIN_EMAIL || "admin@example.com"
        )
            .toLowerCase()
            .trim();

        const password =
            process.env.ADMIN_PASSWORD || "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.deleteMany({});

        await Admin.create({
            username,
            email,
            password: hashedPassword,
        });

        res.json({
            success: true,
            message: "Admin created/reset successfully!",
            username,
            email,
        });
    } catch (error) {
        console.error("Seed error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cv", cvRoutes);

// =========================
// 404
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// =========================
// ERROR HANDLER
// =========================

app.use(errorHandler);

// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🌐 Allowed CORS origins:", allowedOrigins);
});