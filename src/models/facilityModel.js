// src/models/facilityModel.js

import { query } from '../config/dbConfig.js';

const FACILITIES_TABLE = 'facilities';
const JOIN_TABLE = 'mosque_facilities';

export default class FacilityModel {
  /**
   * Fetch all facility options.
   * @returns {Promise<Array<{id: string, name: string}>>}
   */
  static async findAll() {
    const text = `SELECT id, name FROM ${FACILITIES_TABLE} ORDER BY name`;
    const { rows } = await query(text);
    return rows;
  }

  /**
   * Fetch facilities associated with a given mosque.
   * @param {string} mosqueId
   * @returns {Promise<Array<{id: string, name: string}>>}
   */
  static async findByMosqueId(mosqueId) {
    const text = `
      SELECT f.id, f.name
      FROM ${FACILITIES_TABLE} f
      JOIN ${JOIN_TABLE} mf ON mf.facility_id = f.id
      WHERE mf.mosque_id = $1
    `;
    const { rows } = await query(text, [mosqueId]);
    return rows;
  }

  /**
   * Set the list of facilities for a mosque.
   * Overwrites any existing associations.
   * @param {string} mosqueId
   * @param {string[]} facilityIds
   */
  static async setForMosque(mosqueId, facilityIds = []) {
    // 1. Remove all existing facilities for this mosque
    await query(
      `DELETE FROM ${JOIN_TABLE} WHERE mosque_id = $1`,
      [mosqueId]
    );

    // 2. Insert new associations (if any)
    if (!Array.isArray(facilityIds) || facilityIds.length === 0) {
      return;
    }

    const placeholders = facilityIds
      .map((_, idx) => `($1, $${idx + 2})`)
      .join(', ');
    const values = [mosqueId, ...facilityIds];

    const text = `
      INSERT INTO ${JOIN_TABLE} (mosque_id, facility_id)
      VALUES ${placeholders}
    `;
    await query(text, values);
  }

    /**
   * Return all facilities attached to a mosque.
   */
    static async findByMosqueId(mosqueId) {
      const text = `
        SELECT f.id, f.name
        FROM facilities f
        JOIN mosque_facilities mf
          ON mf.facility_id = f.id
        WHERE mf.mosque_id = $1
      `;
      const { rows } = await query(text, [mosqueId]);
      return rows;
    }
}
