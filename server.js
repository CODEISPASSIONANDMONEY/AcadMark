import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL database");

    app.listen(PORT, () => {
      console.log(`🚀 AcadMark server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to MySQL database:", error.message);
    process.exit(1);
  }
}

startServer();
