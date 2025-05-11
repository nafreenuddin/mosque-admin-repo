// // src/routes/lookupRoutes.js

// import express from 'express';
// import FacilityModel from '../models/facilityModel.js';
// // import authMiddleware from '../middlewares/authMiddleware.js';
// // import validateMiddleware from '../middlewares/validateMiddleware.js';
// import ensureApproved from '../middlewares/ensureApproved.js';
// // import updateProfileInfo from '../controllers/mosqueController.js'; // or a dedicated controller


// const router = express.Router();

// /**
//  * GET /api/lookup/facilities
//  * Public. Returns the list of all available facility options.
//  */
// router.get('/facilities',ensureApproved, async (req, res, next) => {
//   try {
//     const facilities = await FacilityModel.findAll();
//     res.json({ facilities });
//   } catch (err) {
//     next(err);
//   }
// });

// // router.put(
// //   '/:id/facilities',
// //   authMiddleware,
// //   ensureApproved,                // ← block until approved
// //   validateMiddleware([
// //     { field: 'facilityIds', required: true, type: 'object' },
// //   ]),
// //   updateProfileInfo              // or a dedicated updateFacilities handler
// // );

// export default router;


import express from 'express';
import FacilityModel from '../models/facilityModel.js';

const router = express.Router();

// GET /api/v1/lookup/facilities
router.get(
  '/facilities',
  async (req, res, next) => {
    try {
      const list = await FacilityModel.findAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
