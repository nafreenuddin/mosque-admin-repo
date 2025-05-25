//src/utils/errorHandlers.js

import express from "express";

/**
 * Configure error handlers for the app
 * @param {express.Application} app - Express application
 */
const errorHandlers = (app) => {
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
};

export default errorHandlers;