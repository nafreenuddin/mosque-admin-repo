// src/middlewares/ensureApproved.js
import mosqueService from '../services/mosqueService.js';

/**
 * Middleware that ensures the target mosque is approved.
 * Expects req.params.id (or req.params.mosqueId).
 */
export default async function ensureApproved(req, res, next) {
  try {
    const mosqueId = req.params.id ?? req.params.mosqueId;
    const mosque = await mosqueService.findById(mosqueId);
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    if (mosque.status !== 'approved') {
      return res
        .status(403)
        .json({ error: 'Operation not allowed until mosque is approved' });
    }
    // attach for downstream use if needed
    req.mosque = mosque;
    next();
  } catch (err) {
    next(err);
  }
}
