// // src/models/prayerTimingsModel.js

// import { query } from '../config/dbConfig.js';

// const TABLE = 'prayer_timings';

// export default class PrayerTimingsModel {
//   /**
//    * Find prayer timings by mosque ID.
//    * @param {string} mosqueId
//    * @returns {Promise<Object|null>} The timings row or null
//    */
//   static async findByMosqueId(mosqueId) {
//     const text = `
//       SELECT id, mosque_id, fajr, dhuhr, asr, maghrib, isha, jumuah, updated_at
//       FROM ${TABLE}
//       WHERE mosque_id = $1
//       LIMIT 1
//     `;
//     const { rows } = await query(text, [mosqueId]);
//     return rows[0] || null;
//   }

//   /**
//    * Create prayer timings for a mosque.
//    * @param {Object} data
//    * @param {string} data.mosqueId
//    * @param {string} data.fajr
//    * @param {string} data.dhuhr
//    * @param {string} data.asr
//    * @param {string} data.maghrib
//    * @param {string} data.isha
//    * @param {string} [data.jumuah]
//    * @returns {Promise<Object>} The created prayer_timings row
//    */
//   static async create({ mosqueId, fajr, dhuhr, asr, maghrib, isha, jumuah = null }) {
//     const text = `
//       INSERT INTO ${TABLE}
//         (mosque_id, fajr, dhuhr, asr, maghrib, isha, jumuah)
//       VALUES
//         ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *
//     `;
//     const values = [mosqueId, fajr, dhuhr, asr, maghrib, isha, jumuah];
//     const { rows } = await query(text, values);
//     return rows[0];
//   }

//   /**
//    * Update prayer timings for a mosque.
//    * @param {string} mosqueId
//    * @param {Object} data
//    * @param {string} data.fajr
//    * @param {string} data.dhuhr
//    * @param {string} data.asr
//    * @param {string} data.maghrib
//    * @param {string} data.isha
//    * @param {string} [data.jumuah]
//    * @returns {Promise<Object>} The updated prayer_timings row
//    */
//   static async updateByMosqueId(mosqueId, { fajr, dhuhr, asr, maghrib, isha, jumuah = null }) {
//     const text = `
//       UPDATE ${TABLE}
//       SET fajr = $2,
//           dhuhr = $3,
//           asr = $4,
//           maghrib = $5,
//           isha = $6,
//           jumuah = $7,
//           updated_at = NOW()
//       WHERE mosque_id = $1
//       RETURNING *
//     `;
//     const values = [mosqueId, fajr, dhuhr, asr, maghrib, isha, jumuah];
//     const { rows } = await query(text, values);
//     return rows[0];
//   }

//   static async upsert(mosqueId, { fajr, dhuhr, asr, maghrib, isha }) {
//     const text = `
//       INSERT INTO ${TABLE}
//         (mosque_id, fajr, dhuhr, asr, maghrib, isha)
//       VALUES
//         ($1, $2, $3, $4, $5, $6)
//       ON CONFLICT (mosque_id)
//       DO UPDATE SET
//         fajr    = EXCLUDED.fajr,
//         dhuhr   = EXCLUDED.dhuhr,
//         asr     = EXCLUDED.asr,
//         maghrib = EXCLUDED.maghrib,
//         isha    = EXCLUDED.isha
//       RETURNING *;
//     `;
//     const values = [mosqueId, fajr, dhuhr, asr, maghrib, isha];
//     const { rows } = await query(text, values);
//     return rows[0];
//   }

//   // static async findByMosqueId(mosqueId) {
//   //   const text = `
//   //     SELECT fajr, dhuhr, asr, maghrib, isha
//   //     FROM prayer_timings
//   //     WHERE mosque_id = $1
//   //     LIMIT 1
//   //   `;
//   //   const { rows } = await query(text, [mosqueId]);
//   //   return rows[0] || null;
//   // }

// }

// src/models/prayerTimingsModel.js

// import { query } from '../config/dbConfig.js';
// const TABLE = 'prayer_timings';

// export default class PrayerModel {
//   static async upsert(mosqueId, { fajr, dhuhr, asr, maghrib, isha }) {
//     const text = `
//       INSERT INTO ${TABLE}
//         (mosque_id, fajr, dhuhr, asr, maghrib, isha)
//       VALUES
//         ($1, $2, $3, $4, $5, $6)
//       ON CONFLICT (mosque_id)
//       DO UPDATE SET
//         fajr    = EXCLUDED.fajr,
//         dhuhr   = EXCLUDED.dhuhr,
//         asr     = EXCLUDED.asr,
//         maghrib = EXCLUDED.maghrib,
//         isha    = EXCLUDED.isha
//       RETURNING *;
//     `;
//     const values = [mosqueId, fajr, dhuhr, asr, maghrib, isha];
//     const { rows } = await query(text, values);
//     return rows[0];
//   }

//   static async findByMosqueId(mosqueId) {
//     const text = `
//       SELECT fajr, dhuhr, asr, maghrib, isha
//       FROM ${TABLE}
//       WHERE mosque_id = $1
//       LIMIT 1
//     `;
//     const { rows } = await query(text, [mosqueId]);
//     return rows[0] || null;
//   }
// }
import { query } from '../config/dbConfig.js';

const TABLE = 'prayer_timings';

export default class PrayerModel {
  /**
   * Insert or update prayer timings for a mosque.
   */
  static async upsert(mosqueId, { fajr, dhuhr, asr, maghrib, isha }) {
    const text = `
      INSERT INTO ${TABLE}
        (mosque_id, fajr, dhuhr, asr, maghrib, isha)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (mosque_id)
      DO UPDATE SET
        fajr    = EXCLUDED.fajr,
        dhuhr   = EXCLUDED.dhuhr,
        asr     = EXCLUDED.asr,
        maghrib = EXCLUDED.maghrib,
        isha    = EXCLUDED.isha
      RETURNING *;
    `;
    const values = [mosqueId, fajr, dhuhr, asr, maghrib, isha];
    const { rows } = await query(text, values);
    return rows[0];
  }

  /**
   * Fetch prayer timings for a mosque, or null if none exist.
   */
  static async findByMosqueId(mosqueId) {
    const text = `
      SELECT fajr, dhuhr, asr, maghrib, isha
      FROM ${TABLE}
      WHERE mosque_id = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [mosqueId]);
    return rows[0] || null;
  }
}
