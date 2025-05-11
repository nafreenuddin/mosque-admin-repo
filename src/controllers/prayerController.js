// // src/controllers/prayerController.js

// import prayerService from '../services/prayerService.js';
// import mosqueService from '../services/mosqueService.js';

// /**
//  * PUT /api/mosques/:mosqueId/prayer-timings
//  * Protected. Create or update prayer timings for the given mosque.
//  */
// // export async function setPrayerTimings(req, res, next) {
// //   try {
// //     const { mosqueId } = req.params;
// //     const timings = req.body;

// //     // Validate presence of required timing fields
// //     const required = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
// //     for (const field of required) {
// //       if (typeof timings[field] !== 'string') {
// //         return res.status(400).json({ error: `${field} is required and must be a string` });
// //       }
// //     }

// //     const result = await prayerService.setPrayerTimings(mosqueId, timings);
// //     res.json({ prayerTimings: result });
// //   } catch (err) {
// //     next(err);
// //   }
// // }

// /**
//  * GET /api/mosques/:mosqueId/prayer-timings
//  * Public. Retrieve prayer timings for the given mosque.
//  */
// export async function getPrayerTimings(req, res, next) {
//   try {
//     const { mosqueId } = req.params;
//     const timings = await prayerService.getPrayerTimings(mosqueId);
//     if (!timings) {
//       return res.status(404).json({ error: 'Prayer timings not found' });
//     }
//     res.json({ prayerTimings: timings });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function updatePrayerTimings(req, res, next) {
//   try {
//     const adminId   = req.adminId;
//     const { mosqueId } = req.params;
//     const timings = req.body; // { fajr, dhuhr, asr, maghrib, isha }

//     // ownership check
//     const existing = await mosqueService.findById(mosqueId);
//     if (existing.created_by_admin !== adminId) {
//       return res.status(403).json({ error: 'Not authorized' });
//     }

//     const prayerTimings = await prayerService.updateTimings(mosqueId, timings);
//     res.json({ prayerTimings });
//   } catch (err) {
//     next(err);
//   }
// }

// import prayerService from '../services/prayerService.js';

// export async function setPrayerTimings(req, res, next) {
//   const { mosqueId } = req.params;
//   const timings      = req.body;
//   const updated      = await prayerService.setPrayerTimings(mosqueId, timings);
//   res.json({ prayerTimings: updated });
// }

// export async function getPrayerTimings(req, res, next) {
//   const { mosqueId } = req.params;
//   const existing     = await prayerService.getPrayerTimings(mosqueId);
//   if (!existing) return res.status(404).json({ error: 'No prayer timings set' });
//   res.json({ prayerTimings: existing });
// }
import prayerService from '../services/prayerService.js';
import mosqueService from '../services/mosqueService.js';

export async function setPrayerTimings(req, res, next) {
  try {
    const adminId   = req.adminId;
    const { mosqueId } = req.params;
    const timings   = req.body;

    // ensure mosque exists and belongs to this admin
    const mosque = await mosqueService.findById(mosqueId);
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    if (mosque.created_by_admin !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const prayerTimings = await prayerService.setPrayerTimings(mosqueId, timings);
    res.json({ prayerTimings });
  } catch (err) {
    next(err);
  }
}

export async function getPrayerTimings(req, res, next) {
  try {
    const { mosqueId } = req.params;
    const existing     = await prayerService.getPrayerTimings(mosqueId);
    if (!existing) {
      return res.status(404).json({ error: 'No prayer timings set' });
    }
    res.json({ prayerTimings: existing });
  } catch (err) {
    next(err);
  }
}
