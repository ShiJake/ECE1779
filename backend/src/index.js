import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
console.log("Using JWT secret:", JWT_SECRET);

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const [, token] = header.split(" ");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch (e) {
    res.status(503).json({ status: "db_not_ready", error: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: "Email is required" });

  try {
    // Create user if not exists
    const result = await pool.query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id, email`,
      [email]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/me", auth, (req, res) => {
  return res.json({ id: req.user.id, email: req.user.email });
});

app.get("/api/entries", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, date, type, quantity
       FROM entries
       WHERE user_id = $1
       ORDER BY date ASC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Entries fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/entries", auth, async (req, res) => {
  const { date, type, quantity } = req.body;

  if (!date || !type || !quantity)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const result = await pool.query(
      `INSERT INTO entries (user_id, date, type, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING id, date, type, quantity`,
      [req.user.id, date, type, quantity]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Entry insert error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
