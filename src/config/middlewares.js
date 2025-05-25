// src/config/middlewares.js
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configure all application middlewares
 * @param {express.Application} app - Express application
 */
const setupMiddlewares = (app) => {
  // --- Security & Logging ---
  app.use(helmet());
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }
  
  // Allow your frontend origin
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));

  // --- Body Parsing ---
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

export default setupMiddlewares;