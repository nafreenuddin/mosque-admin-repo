import { getNearby } from '../services/placesService.js';

export default async function geoFence(req, res, next) {
  const { latitude, longitude } = req.body;
  const nearby = await getNearby(latitude, longitude);
  if (!nearby.length) {
    return res
      .status(400)
      .json({ error: 'You must be on-site at a recognized mosque.' });
  }
  // Attach the nearest place_id & name for duplication check
  req.body.place_id   = nearby[0].place_id;
  req.body.place_name = nearby[0].name;
  next();
}
