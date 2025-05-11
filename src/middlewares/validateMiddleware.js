// src/middlewares/validateMiddleware.js

/**
 * Creates middleware to validate request body fields.
 * @param {Array<Object>} rules
 *   Each rule is an object: 
 *     { field: string, required?: boolean, type?: 'string'|'number'|'boolean' }
 * @returns {Function} Express middleware
 */
export default function validateMiddleware(rules) {
    return (req, res, next) => {
      for (const rule of rules) {
        const { field, required, type } = rule;
        const value = req.body[field];
  
        if (required && (value === undefined || value === null)) {
          return res.status(400).json({ error: `${field} is required` });
        }
        if (value !== undefined && type && typeof value !== type) {
          return res
            .status(400)
            .json({ error: `${field} must be of type ${type}` });
        }
      }
      next();
    };
  }
  