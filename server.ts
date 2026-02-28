import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { diagnosisController } from "./src/services/diagnosis.js";

const db = new Database("neuromed.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS diagnosis_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symptoms TEXT,
    urgency TEXT,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/diagnose", async (req, res) => {
    try {
      const { symptoms } = req.body;
      const diagnosis = await diagnosisController(symptoms);
      res.json(diagnosis);
    } catch (error) {
      console.error("Diagnosis Route Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
