// src/controllers/adminMosqueController.js
import mosqueService from '../services/mosqueService.js';
import prayerService  from '../services/prayerService.js';
import facilityModel  from '../models/facilityModel.js';

/**
 * GET /api/v1/admin/mosque
 * → returns the full mosque record for the logged-in admin
 */
// export async function getFullMosqueDetails(req, res, next) {
//   try {
//     const adminId = req.adminId;
//     const mosque  = await mosqueService.findByAdminId(adminId);
//     if (!mosque) {
//       return res.status(404).json({ error: 'No mosque found' });
//     }
//     res.json({ mosque });
//   } catch (err) {
//     next(err);
//   }
// }

/**
 * GET /api/v1/admin/mosque/status
 * → returns only status, isMosqueApproved, and review_notes
 */
export async function getMyMosqueStatus(req, res, next) {
  try {
    const adminId = req.adminId;
    const m       = await mosqueService.findByAdminId(adminId);
    if (!m) {
      return res.status(404).json({ error: 'No mosque found' });
    }
    res.json({
      status:           m.status,
      isMosqueApproved: m.is_mosque_approved,
      review_notes:     m.review_notes || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/admin/mosque/status
 * → back-office only: update only status & optional notes
 */
export async function updateMosqueStatus(req, res, next) {
  try {
    const { status, review_notes } = req.body;
    const { id }                   = req.body;   // if you want to pass mosque ID in body
    // If you prefer query param: const mosqueId = req.query.mosqueID;
    // or secured by adminId: find by adminId
    
    // Using query param:
    // const mosqueId = req.query.mosqueID;
    // Using body id:
    const mosqueId = id;
    
    const updated = await mosqueService.updateStatus(mosqueId, status, review_notes);
    res.json({ success: true, mosque: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/mosque
 * → dashboard: mosque + profile + prayer timings + facilities
 */
// export async function getFullMosqueDetails(req, res, next) {
//   try {
//     const adminId = req.adminId;
//     const mosque  = await mosqueService.findByAdminId(adminId);
//     if (!mosque) {
//       return res.status(404).json({ error: 'No mosque found' });
//     }

//     // fetch prayer timings (may be null initially)
//     //const prayerTimings = await prayerService.findByMosqueId(mosque.id);

//     const prayerTimings = await prayerService.getPrayerTimings(mosque.id);

//     // fetch facilities list
//     const facilities = await facilityModel.findByMosqueId(mosque.id);

//     res.json({
//       mosque,
//       profile: {
//         description:   mosque.description,
//         contact_phone: mosque.contact_phone,
//         facilities,   // array of {id, name}
//       },
//       prayerTimings: prayerTimings || {}
//     });
//   } catch (err) {
//     next(err);
//   }
// }
export async function getFullMosqueDetails(req, res, next) {
  try {
    const adminId = req.adminId;
    const mosque  = await mosqueService.findByAdminId(adminId);
    if (!mosque) {
      return res.status(404).json({ error: 'No mosque found' });
    }

    // Correct method name here:
    const prayerTimings = await prayerService.getPrayerTimings(mosque.id);
    const facilities    = await facilityModel.findByMosqueId(mosque.id);

    return res.json({
      mosque,
      profile: {
        description:   mosque.description,
        contact_phone: mosque.contact_phone,
        facilities,
      },
      prayerTimings: prayerTimings || {}
    });
  } catch (err) {
    next(err);
  }
}
