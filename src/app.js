// src/app.js
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminMosqueRoutes from "./routes/adminMosqueRoutes.js";
import lookupRoutes from "./routes/lookupRoutes.js";
import mosqueRoutes from "./routes/mosqueRoutes.js";
import prayerRoutes from "./routes/prayerRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
// import adminMosqueRoutes from "./routes/adminMosqueRoutes.js";

const app = express();

// --- Security & Logging ---
app.use(helmet());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}
// Allow your frontend origin (or * in prod)
app.use(cors({ origin: "http://localhost:5173" }));

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Versioned /api/v1 Router ---
const v1 = express.Router();

// Auth (OTP + JWT)
v1.use("/auth", authRoutes);

// Admin-side mosque endpoints (full record + status)
v1.use("/admin/mosque", adminMosqueRoutes);

// Lookup (e.g. facilities)
v1.use("/lookup", lookupRoutes);




// Public mosque CRUD
v1.use("/mosques", mosqueRoutes);

// Prayer-times is a subresource
v1.use(
  '/mosques/:mosqueId/prayer-times',
  authMiddleware,
  prayerRoutes
);


// Mount v1 under both /api/v1 and /api for backward compatibility
app.use("/api/v1", v1);
app.use("/api", v1);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

v1.get('/ping', (_req, res) => res.json({ ok: true }));
v1.get('/health', (_req, res) => res.json({ ok: true }));
v1.get('/status', (_req, res) => res.json({ ok: true }));

export default app;
