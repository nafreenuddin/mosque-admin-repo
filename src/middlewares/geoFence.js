// src/middlewares/geoFence.js

import { getNearbyMosques } from '../services/placesService.js';

export default async function geoFence(req, res, next) {
  try {
    const { latitude, longitude } = req.body;
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number'
    ) {
      return res
        .status(400)
        .json({ error: 'latitude and longitude must be numbers' });
    }

    // call Google Places
    const nearby = await getNearbyMosques(latitude, longitude);

    if (!nearby.length) {
      return res
        .status(400)
        .json({ error: 'You must be on-site at a recognized mosque.' });
    }

    // Attach the nearest place_id & name for duplication checks downstream
    const nearest = nearby[0];
    req.body.place_id   = nearest.place_id;
    req.body.place_name = nearest.name;

    next();
  } catch (err) {
    next(err);
  }
}
