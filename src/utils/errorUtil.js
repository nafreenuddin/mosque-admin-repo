// src/utils/errorUtil.js

/**
 * Custom Error class that includes an HTTP status code.
 */
export class AppError extends Error {
    /**
     * @param {string} message  Error message
     * @param {number} statusCode  HTTP status code (e.g. 400, 404, 500)
     */
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      // Maintains proper stack trace (only on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  /**
   * Helper to create and throw an AppError.
   * @param {number} statusCode
   * @param {string} message
   * @throws {AppError}
   */
  export function createError(statusCode, message) {
    throw new AppError(message, statusCode);
  }
  