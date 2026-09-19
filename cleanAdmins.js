import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const cleanAdmins = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to:", mongoose.connection.name);

    const result = await mongoose.connection.db
      .collection("admins")
      .deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} admin(s) from database`);

    const remaining = await mongoose.connection.db
      .collection("admins")
      .countDocuments();

    console.log(`📊 Remaining admins: ${remaining}`);

    await mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

cleanAdmins();