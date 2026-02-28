import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { diagnosisController } from "./src/services/diagnosis.js";

const db = new Database("neuromed.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    age INTEGER,
    gender TEXT,
    existing_conditions TEXT,
    medications TEXT,
    allergies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS diagnosis_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    symptoms TEXT,
    extracted_entities TEXT,
    differential_diagnosis TEXT,
    urgency TEXT,
    confidence_score INTEGER,
    risk_profile TEXT,
    suggested_actions TEXT,
    red_flags_detected BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    action TEXT,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Middleware for audit logging
const auditLogger = (req: any, res: any, next: any) => {
  const originalSend = res.send;
  res.send = function(body: any) {
    if (req.path.startsWith('/api')) {
      const userEmail = req.body?.user_email || req.query?.email || 'anonymous';
      db.prepare("INSERT INTO audit_logs (user_email, action, details) VALUES (?, ?, ?)")
        .run(userEmail, `${req.method} ${req.path}`, JSON.stringify({ body: req.body, query: req.query }));
    }
    return originalSend.apply(res, arguments);
  };
  next();
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(auditLogger);

  // Error Handling Middleware
  const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.error(`[SERVER ERROR] ${new Date().toISOString()}:`, err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: process.env.NODE_ENV === 'production' ? "An unexpected error occurred." : err.message 
    });
  };

  // API Routes
  app.get("/api/user/profile", (req, res) => {
    const email = req.query.email as string;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    res.json(user || null);
  });

  app.post("/api/user/profile", (req, res) => {
    const { email, name, age, gender, existing_conditions, medications, allergies } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (email, name, age, gender, existing_conditions, medications, allergies)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(email, name, age, gender, existing_conditions, medications, allergies);
    res.json({ success: true });
  });

  app.get("/api/history", (req, res) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const history = db.prepare("SELECT * FROM diagnosis_history WHERE user_email = ? ORDER BY created_at DESC").all(email);
    res.json(history);
  });

  app.post("/api/diagnosis", (req, res) => {
    const { 
      user_email, symptoms, extracted_entities, differential_diagnosis, 
      urgency, confidence_score, risk_profile, suggested_actions, red_flags_detected 
    } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO diagnosis_history (
        user_email, symptoms, extracted_entities, differential_diagnosis, 
        urgency, confidence_score, risk_profile, suggested_actions, red_flags_detected
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      user_email, 
      symptoms, 
      JSON.stringify(extracted_entities), 
      JSON.stringify(differential_diagnosis), 
      urgency, 
      confidence_score, 
      JSON.stringify(risk_profile), 
      JSON.stringify(suggested_actions),
      red_flags_detected ? 1 : 0
    );
    
    res.json({ id: info.lastInsertRowid });
  });

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

  app.get("/api/admin/stats", (req, res) => {
    try {
      const totalDiagnosis = db.prepare("SELECT COUNT(*) as count FROM diagnosis_history").get() as { count: number } || { count: 0 };
      const urgencyStats = db.prepare("SELECT urgency, COUNT(*) as count FROM diagnosis_history GROUP BY urgency").all() || [];
      const confidenceTrend = db.prepare("SELECT DATE(created_at) as date, AVG(confidence_score) as avg_confidence FROM diagnosis_history GROUP BY DATE(created_at) LIMIT 30").all() || [];
      const recentLogs = db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20").all() || [];
      
      res.json({
        totalDiagnosis: totalDiagnosis.count,
        urgencyStats,
        confidenceTrend,
        recentLogs
      });
    } catch (error) {
      console.error("Admin Stats Fetch Failed:", error);
      res.json({
        totalDiagnosis: 0,
        urgencyStats: [],
        confidenceTrend: [],
        recentLogs: []
      });
    }
  });

  // Vite middleware for development
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

  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
