// src/app.js
import express from "express";
// import helmet from "helmet";
// import morgan from "morgan";
// import cors from "cors";
// import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminMosqueRoutes from "./routes/adminMosqueRoutes.js";
import lookupRoutes from "./routes/lookupRoutes.js";
import mosqueRoutes from "./routes/mosqueRoutes.js";
import prayerRoutes from "./routes/prayerRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
// import adminMosqueRoutes from "./routes/adminMosqueRoutes.js";
import errorHandlers from "./utils/errorHandlers.js";
import setupMiddlewares from "./config/middlewares.js";
import healthRoutes from "./config/healthRoutes.js";
import rateLimit from 'express-rate-limit';
import placesRoutes from "./routes/placesRoutes.js";
// dotenv.config();
const app = express();

// // --- Security & Logging ---
// app.use(helmet());
// if (process.env.NODE_ENV !== "test") {
//   app.use(morgan("combined"));
// }
// // --- CORS ---
// // Allow your frontend origin (or * in prod)
// app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));

// // --- Body Parsing ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//configure all middlewares
setupMiddlewares(app);

// --- Versioned /api/v1 Router ---
const v1 = express.Router();
const pinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  keyGenerator: (req) => req.body.mobile || req.ip,
  handler: (_, res) =>
    res.status(429).json({
      error: 'Too many attempts—please try again later or reset your PIN.'
    }),
  skipSuccessfulRequests: true
});
// Auth (OTP + JWT)
v1.use("/auth", pinLimiter, authRoutes);

// Admin-side mosque endpoints (full record + status)
v1.use("/admin/mosque", adminMosqueRoutes);

// Lookup (e.g. facilities)
v1.use("/lookup", lookupRoutes);

// Public mosque CRUD
v1.use("/mosques", mosqueRoutes);

// Prayer-times is a subresource
v1.use("/mosques/:mosqueId/prayer-times", authMiddleware, prayerRoutes);

// Mount v1 under both /api/v1 and /api for backward compatibility
app.use("/api/v1", v1);
app.use("/api", v1);

// // --- Health Check ---
v1.use("/", healthRoutes);

v1.use('/places', placesRoutes);

// // --- 404 Handler ---
// app.use((req, res) => {
//   res.status(404).json({ error: "Not Found" });
// });

// --- Global Error Handler ---
// app.use((err, req, res, next) => {
//   console.error(err);
//   const status = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(status).json({ error: message });
// });
errorHandlers(app);

export default app;
