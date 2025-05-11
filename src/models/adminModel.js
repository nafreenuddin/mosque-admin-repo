import { query } from '../config/dbConfig.js';

const TABLE = 'adminstable';

export default class AdminModel {

  /**
   * Create a new admin (with pin_hash).
   * @param {{ mobile:string, name:string, email:string, pin_hash:string }} data
   */


  // static async create({ mobile, name = null, email = null }) {
  //   const text = `
  //     INSERT INTO ${TABLE} (mobile, name, email)
  //     VALUES ($1, $2, $3)
  //     RETURNING *
  //   `;
  //   const values = [mobile, name, email];
  //   const { rows } = await query(text, values);
  //   return rows[0];
  // }

  static async create({ mobile, name, email, pin_hash }) {
    const text = `
      INSERT INTO ${TABLE}
        (mobile, name, email, pin_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [mobile, name, email, pin_hash];
    const { rows } = await query(text, values);
    return rows[0];
  }

  // static async findByMobile(mobile) {
  //   const text = `
  //     SELECT *
  //     FROM ${TABLE}
  //     WHERE mobile = $1
  //     LIMIT 1
  //   `;
  //   const { rows } = await query(text, [mobile]);
  //   return rows[0] || null;
  // }

  static async findByMobile(mobile) {
    const text = `
      SELECT * FROM ${TABLE}
      WHERE mobile = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [mobile]);
    return rows[0] || null;
  }

  // static async findByEmail(email) {
  //   const text = `
  //     SELECT *
  //     FROM ${TABLE}
  //     WHERE email = $1
  //     LIMIT 1
  //   `;
  //   const { rows } = await query(text, [email]);
  //   return rows[0] || null;
  // }

    static async findByEmail(email) {
    const text = `
      SELECT * FROM ${TABLE}
      WHERE email = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [email]);
    return rows[0] || null;
  }

  /**
   * Update admin fields (dynamic).
   * @param {string} id
   * @param {Object} fields  e.g. { name, email }
   */
  static async update(id, fields) {
    const keys = Object.keys(fields);
    const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = [id, ...keys.map(k => fields[k])];

    const text = `
      UPDATE ${TABLE}
      SET ${sets}
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, values);
    return rows[0];
  }
  // static async findByAdminId(adminId) {
  //   const text = `
  //     SELECT *
  //     FROM mosques
  //     WHERE created_by_admin = $1
  //     LIMIT 1
  //   `;
  //   const { rows } = await query(text, [adminId]);
  //   return rows[0] || null;
  // }

  static async findByAdminId(adminId) {
    const text = `SELECT *, is_mosque_approved FROM mosques WHERE created_by_admin = $1 LIMIT 1`;
    const { rows } = await query(text, [adminId]);
    return rows[0] || null;
  }
}
