// src/controllers/mosqueController.js

import mosqueService from '../services/mosqueService.js';
/**
 * POST /api/mosques
 * Protected. Create a new mosque registration.
 */
export async function createMosque(req, res, next) {
  try {
    const adminId = req.adminId;
    // Prevent an admin from registering multiple mosques
    const existing = await mosqueService.findByAdminId(adminId);
    if (existing) {
      return res.status(400).json({ error: 'Admin already owns a mosque' });
    }
    const data = req.body;
    // Required fields check
    const required = ['name', 'address_line', 'city', 'country', 'latitude', 'longitude'];
    for (const field of required) {
      if (data[field] === undefined) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const mosque = await mosqueService.createMosque(adminId, data);
    res.status(201).json({ mosque });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/mosques
 * Public. List all mosques (basic fields only).
 */
// export async function listMosques(req, res, next) {
//   try {
//     // For now, list all. Pagination/filtering can be added later.
//     const mosques = await mosqueService.listAll(); 
//     res.json({ mosques });
//   } catch (err) {
//     next(err);
//   }
// }
export async function listMosques(req, res, next) {
    try {
      const mosques = await mosqueService.listAll();
      res.json({ mosques });
    } catch (err) {
      next(err);
    }
  }

/**
 * GET /api/mosques/:id
 * Public. Get full details of one mosque.
 */
export async function getMosqueById(req, res, next) {
  try {
    const { id } = req.params;
    const mosque = await mosqueService.findById(id);
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    res.json({ mosque });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/mosques/:id
 * Protected. Update mosque fields (general info or profileCompleted).
 */
export async function updateMosque(req, res, next) {
  try {
    const adminId = req.adminId;
    const { id } = req.params;

    // Ensure this admin owns the mosque
    const existing = await mosqueService.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    if (existing.created_by_admin !== adminId) {
      return res.status(403).json({ error: 'Not authorized to update this mosque' });
    }

    const updates = req.body;
    const updated = await mosqueService.updateMosque(id, updates);
    res.json({ mosque: updated });
  } catch (err) {
    next(err);
  }
};

export async function updateProfileInfo(req, res, next) {
    try {
      const adminId = req.adminId;
      const { id } = req.params;
      const { description, contact_phone, facilityIds } = req.body;
  
      // Ensure this admin owns the mosque
      const existing = await mosqueService.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Mosque not found' });
      }
      if (existing.created_by_admin !== adminId) {
        return res.status(403).json({ error: 'Not authorized to update this mosque' });
      }
  
      // Perform profile update
      const updated = await mosqueService.updateProfile(id, {
        description,
        contact_phone,
        facilityIds,
      });
  
      res.json({ mosque: updated });
    } catch (err) {
      next(err);
    }
}

// /**
//  * PUT /api/mosques/:id/status
//  * Back-office only. Upserts the status (e.g. under_review → approved).
//  * Body: { status: 'approved'|'rejected', review_notes?: string }
//  */
// export async function upsertStatus(req, res, next) {
//   try {
//     const { id } = req.params;
//     const { status, review_notes } = req.body;
//     const updated = await mosqueService.updateStatus(id, status, review_notes);
//     res.json({ mosque: updated });
//   } catch (err) {
//     next(err);
//   }
// }

/**
 * PUT /api/mosques/:id/status
 * Back-office only. Upsert the approval status.
 * Body: { status: 'under_review'|'approved'|'rejected', review_notes?: string }
 */
export async function upsertStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, review_notes = null } = req.body;

    // Validate status value
    if (!['under_review', 'approved', 'rejected'].includes(status)) {
      return res
        .status(400)
        .json({ error: 'Invalid status. Must be under_review, approved, or rejected.' });
    }

    const updated = await mosqueService.updateStatus(id, status, review_notes);
    res.json({ mosque: updated });
  } catch (err) {
    next(err);
  }
}
/**
 * PUT /api/mosques/:id/complete-profile
 * Protected & approved only. Flips profile_completed → true.
 */
// export async function completeProfile(req, res, next) {
//   try {
//     const adminId = req.adminId;
//     const { id } = req.params;

//     // 1. Check mosque exists and ownership
//     const existing = await mosqueService.findById(id);
//     if (!existing) {
//       return res.status(404).json({ error: 'Mosque not found' });
//     }
//     if (existing.created_by_admin !== adminId) {
//       return res.status(403).json({ error: 'Not authorized' });
//     }

//     // 2. Ensure it’s approved
//     if (existing.status !== 'approved') {
//       return res
//         .status(403)
//         .json({ error: 'Cannot complete profile until mosque is approved' });
//     }

//     // 3. Mark as complete
//     const updated = await mosqueService.completeProfile(id);
//     res.json({ success: true, mosque: updated });
//   } catch (err) {
//     next(err);
//   }
// }

/**
 * PUT /api/mosques/:id/status
 * Back-office only: flip status & optional notes
 */
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    // validate allowed statuses
    const allowed = ['under_review','approved','rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await mosqueService.updateStatus(id, status, review_notes);
    res.json({ success: true, mosque: updated });
  } catch (err) {
    next(err);
  }
}

export async function completeMosque(req, res, next) {
  try {
    const adminId   = req.adminId;
    const { mosqueId } = req.params;

    const existing = await mosqueService.findById(mosqueId);
    if (!existing) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    if (existing.created_by_admin !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (existing.is_mosque_approved) {
      return res.status(400).json({ error: 'Mosque already completed' });
    }

    const mosque = await mosqueService.completeProfile(mosqueId);
    return res.json({ success: true, mosque });
  } catch (err) {
    next(err);
  }
}