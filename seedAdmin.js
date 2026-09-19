app.get("/api/seed-now", async (req, res) => {
  try {
    const Admin = (await import("./models/Admin.js")).default;
    const bcrypt = (await import("bcryptjs")).default;

    const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
    const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
    const rawPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await Admin.deleteMany({});
    await Admin.create({ username, email, password: hashedPassword });

    res.json({
      success: true,
      message: "Admin created/reset successfully!",
      username,
      email,
      password: rawPassword,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});