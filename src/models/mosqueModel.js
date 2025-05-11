// src/models/mosqueModel.js

import { query } from '../config/dbConfig.js';

const TABLE = 'mosques';

export default class MosqueModel {
  // /**
  //  * Create a new mosque record (status defaults to under_review).
  //  * @param {Object} data
  //  * @param {string} data.name
  //  * @param {string} data.address_line
  //  * @param {string} data.city
  //  * @param {string} [data.state]
  //  * @param {string} data.country
  //  * @param {string} [data.postal_code]
  //  * @param {string} [data.location_type]
  //  * @param {number} data.latitude
  //  * @param {number} data.longitude
  //  * @param {string} data.created_by_admin
  //  */
  // static async create(data) {
  //   const text = `
  //     INSERT INTO ${TABLE}
  //       (name, address_line, city, state, country, postal_code,
  //        location_type, latitude, longitude, created_by_admin)
  //     VALUES
  //       ($1, $2, $3, $4, $5, $6,
  //        $7, $8, $9, $10)
  //     RETURNING *
  //   `;
  //   const values = [
  //     data.name,
  //     data.address_line,
  //     data.city,
  //     data.state || null,
  //     data.country,
  //     data.postal_code || null,
  //     data.location_type || null,
  //     data.latitude,
  //     data.longitude,
  //     data.created_by_admin,
  //   ];
  //   const { rows } = await query(text, values);
  //   return rows[0];
  // }

   /**
   * Create a new mosque record (status defaults to under_review).
   * @param {Object} data
   * @param {string} data.name
   * @param {string} data.address_line
   * @param {string} data.city
   * @param {string} [data.state]
   * @param {string} data.country
   * @param {string} [data.postal_code]
   * @param {string} [data.location_type]
   * @param {number} data.latitude
   * @param {number} data.longitude
   * @param {string} data.created_by_admin
   */
  static async create(data) {
    const text = `
      INSERT INTO ${TABLE}
        (name,
         address_line,
         city,
         state,
         country,
         postal_code,
         location_type,
         latitude,
         longitude,
         created_by_admin)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      data.name,
      data.address_line,
      data.city,
      data.state  || null,
      data.country,
      data.postal_code  || null,
      data.location_type|| null,
      data.latitude,
      data.longitude,
      data.created_by_admin,
    ];
    const { rows } = await query(text, values);
    return rows[0];
  }

  /**
   * Find a mosque by its ID.
   * @param {string} id
   */
  static async findById(id) {
    const text = `
      SELECT *
      FROM ${TABLE}
      WHERE id = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [id]);
    return rows[0] || null;
  }

  /**
   * Find a mosque owned by a given admin.
   * @param {string} adminId
   */
  static async findByAdminId(adminId) {
    const text = `
      SELECT *
      FROM ${TABLE}
      WHERE created_by_admin = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [adminId]);
    return rows[0] || null;
  }

  /**
   * Update mosque fields (for general info or profileCompleted flip).
   * @param {string} id
   * @param {Object} fields  Any subset of updatable columns.
   */
  static async update(id, fields) {
    // Dynamically build SET clause
    const keys = Object.keys(fields);
    const sets = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...keys.map((k) => fields[k])];

    const text = `
      UPDATE ${TABLE}
      SET ${sets}
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, values);
    return rows[0];
  }

  /**
   * Update only the status (e.g. under_review → approved/rejected).
   * @param {string} id
   * @param {string} status
   * @param {string} [review_notes]
   */
  static async updateStatus(id, status, review_notes = null) {
    const text = `
      UPDATE ${TABLE}
      SET status = $2,
          review_notes = $3
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, [id, status, review_notes]);
    return rows[0];
  }

    /**
   * Fetch all mosques (basic fields only).
   * @returns {Promise<Array>} Array of mosque records
   */
    static async findAll() {
        const text = `
          SELECT 
            id, name, city, country, status, profile_completed, latitude, longitude
          FROM ${TABLE}
          ORDER BY created_at DESC
        `;
        const { rows } = await query(text);
        return rows;
      }
        /**
   * Update only the status column (and review_notes).
   */
  static async updateStatus(id, status, review_notes = null) {
    const text = `
      UPDATE ${TABLE}
      SET status       = $2,
          review_notes = $3
      WHERE id = $1
      RETURNING *`;
    const { rows } = await query(text, [id, status, review_notes]);
    return rows[0];
  }
  /**
 * Mark the mosque as fully approved (profile done).
 */
static async markFullyApproved(id) {
  const text = `
    UPDATE ${TABLE}
    SET is_mosque_approved = TRUE
    WHERE id = $1
    RETURNING *`;
  const { rows } = await query(text, [id]);
  return rows[0];
}
}

