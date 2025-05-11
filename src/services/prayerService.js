// // src/services/prayerService.js

// import PrayerTimingsModel from '../models/prayerTimingsModel.js';

// class PrayerService {
//   /**
//    * Create or update prayer timings for a mosque.
//    * @param {string} mosqueId
//    * @param {Object} timings
//    * @param {string} timings.fajr
//    * @param {string} timings.dhuhr
//    * @param {string} timings.asr
//    * @param {string} timings.maghrib
//    * @param {string} timings.isha
//    * @param {string} [timings.jumuah]
//    * @returns {Promise<Object>} The created or updated prayer timings record
//    */
//   async setPrayerTimings(mosqueId, timings) {
//     // Validate required fields
//     const required = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
//     for (const field of required) {
//       if (typeof timings[field] !== 'string') {
//         throw new Error(`${field} must be provided as a string time`);
//       }
//     }

//     // Check if timings already exist
//     const existing = await PrayerTimingsModel.findByMosqueId(mosqueId);
//     if (existing) {
//       // Update existing
//       return PrayerTimingsModel.updateByMosqueId(mosqueId, timings);
//     } else {
//       // Create new
//       return PrayerTimingsModel.create({ mosqueId, ...timings });
//     }
//   }

//   /**
//    * Retrieve prayer timings for a mosque.
//    * @param {string} mosqueId
//    * @returns {Promise<Object|null>} The timings or null if not set
//    */
//   async getPrayerTimings(mosqueId) {
//     return PrayerTimingsModel.findByMosqueId(mosqueId);
//   }

//   // async updateTimings(mosqueId, timings) {
//   //   // upsert or create entry
//   //   return PrayerModel.upsert(mosqueId, timings);
//   // }

//   // async findByMosqueId(mosqueId) {
//   //   return PrayerModel.findByMosqueId(mosqueId);
//   // }

//     /**
//    * Update or insert prayer timings.
//    */
//     // async updateTimings(mosqueId, timings) {
//     //   return PrayerTimingsModel.upsert(mosqueId, timings);
//     // }

//     async updateTimings(mosqueId, timings) {
//       return PrayerTimingsModel.updateByMosqueId(mosqueId, timings);
//     }
  
//     /**
//      * Fetch existing prayer timings.
//      */
//     async findByMosqueId(mosqueId) {
//       return PrayerTimingsModel.findByMosqueId(mosqueId);
//     }
    
//     /**
//      * Delete prayer timings for a mosque.
//      * @param {string} mosqueId
//      * @returns {Promise<void>}
//      */
//     async deletePrayerTimings(mosqueId) {
//       await PrayerTimingsModel.deleteByMosqueId(mosqueId);
//     }
// }

// export default new PrayerService();

// src/services/prayerService.js

import PrayerModel from '../models/prayerTimingsModel.js';

class PrayerService {
  /**
   * Insert or update prayer timings for a given mosque.
   * @param {string} mosqueId
   * @param {{ fajr:string, dhuhr:string, asr:string, maghrib:string, isha:string }} timings
   * @returns {Promise<Object>} the upserted prayer timings row
   */
  // async setPrayerTimings(mosqueId, timings) {
  //   // You could add additional validation here if desired
  //   const { fajr, dhuhr, asr, maghrib, isha } = timings;
  //   return PrayerModel.upsert(mosqueId, { fajr, dhuhr, asr, maghrib, isha });
  // }
  async setPrayerTimings(mosqueId, timings) {
    return PrayerModel.upsert(mosqueId, timings);
  }

  /**
   * Fetch the existing prayer timings for a mosque (or null if none).
   * @param {string} mosqueId
   * @returns {Promise<Object|null>}
   */
  async getPrayerTimings(mosqueId) {
    return PrayerModel.findByMosqueId(mosqueId);
  }
}

export default new PrayerService();
