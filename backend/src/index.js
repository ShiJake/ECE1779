import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE_URL example: postgresql://user:password@db:5432/sweatsync
const DATABASE_URL = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString: DATABASE_URL });

// Health endpoints for liveness/readiness
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch (e) {
    res.status(503).json({ status: "db_not_ready", error: e.message });
  }
});

// Example route
app.get("/api/ping", (_req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
