import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://sweatsync-frontend.fly.dev",
      "http://localhost:3000", // for local dev
    ],
    credentials: false,
  })
);
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
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const existing = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, hashed]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
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

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch (e) {
    res.status(503).json({ status: "db_not_ready", error: e.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
