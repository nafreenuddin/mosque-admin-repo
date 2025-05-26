// // import { query } from '../config/dbConfig.js';

// import { query } from '../services/dbServices.js';

// const TABLE = 'adminstable';

// export default class AdminModel {

//   /**
//    * Create a new admin (with pin_hash).
//    * @param {{ mobile:string, name:string, email:string, pin_hash:string }} data
//    */


//   // static async create({ mobile, name = null, email = null }) {
//   //   const text = `
//   //     INSERT INTO ${TABLE} (mobile, name, email)
//   //     VALUES ($1, $2, $3)
//   //     RETURNING *
//   //   `;
//   //   const values = [mobile, name, email];
//   //   const { rows } = await query(text, values);
//   //   return rows[0];
//   // }

//   static async create({ mobile, name, email, pin_hash }) {
//     const text = `
//       INSERT INTO ${TABLE}
//         (mobile, name, email, pin_hash)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *
//     `;
//     const values = [mobile, name, email, pin_hash];
//     const { rows } = await query(text, values);
//     return rows[0];
//   }

//   // static async findByMobile(mobile) {
//   //   const text = `
//   //     SELECT *
//   //     FROM ${TABLE}
//   //     WHERE mobile = $1
//   //     LIMIT 1
//   //   `;
//   //   const { rows } = await query(text, [mobile]);
//   //   return rows[0] || null;
//   // }

//   static async findByMobile(mobile) {
//     const text = `
//       SELECT * FROM ${TABLE}
//       WHERE mobile = $1
//       LIMIT 1
//     `;
//     const { rows } = await query(text, [mobile]);
//     return rows[0] || null;
//   }

//   // static async findByEmail(email) {
//   //   const text = `
//   //     SELECT *
//   //     FROM ${TABLE}
//   //     WHERE email = $1
//   //     LIMIT 1
//   //   `;
//   //   const { rows } = await query(text, [email]);
//   //   return rows[0] || null;
//   // }

//     static async findByEmail(email) {
//     const text = `
//       SELECT * FROM ${TABLE}
//       WHERE email = $1
//       LIMIT 1
//     `;
//     const { rows } = await query(text, [email]);
//     return rows[0] || null;
//   }

//   /**
//    * Update admin fields (dynamic).
//    * @param {string} id
//    * @param {Object} fields  e.g. { name, email }
//    */
//   static async update(id, fields) {
//     const keys = Object.keys(fields);
//     const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
//     const values = [id, ...keys.map(k => fields[k])];

//     const text = `
//       UPDATE ${TABLE}
//       SET ${sets}
//       WHERE id = $1
//       RETURNING *
//     `;
//     const { rows } = await query(text, values);
//     return rows[0];
//   }
//   // static async findByAdminId(adminId) {
//   //   const text = `
//   //     SELECT *
//   //     FROM mosques
//   //     WHERE created_by_admin = $1
//   //     LIMIT 1
//   //   `;
//   //   const { rows } = await query(text, [adminId]);
//   //   return rows[0] || null;
//   // }

//   static async findByAdminId(adminId) {
//     const text = `SELECT *, is_mosque_approved FROM mosques WHERE created_by_admin = $1 LIMIT 1`;
//     const { rows } = await query(text, [adminId]);
//     return rows[0] || null;
//   }

//   static async updatePinHash(id, pinHash) {
//   const text = `
//     UPDATE admins
//     SET pin_hash = $2
//     WHERE id = $1
//   `;
//   await query(text, [id, pinHash]);
// }
// }



// src/models/adminModel.js

import { query } from '../services/dbServices.js';

const TABLE = 'adminstable';  // make sure this matches your actual table name

export default class AdminModel {
  /**
   * Create a new admin account.
   * @param {{ mobile:string, name:string, email:string, pin_hash:string }} data
   * @returns {Promise<Object>} the inserted row
   */
  static async create({ mobile, name, email, pin_hash }) {
    const text = `
      INSERT INTO ${TABLE}
        (mobile, name, email, pin_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [ mobile, name, email, pin_hash ];
    const { rows } = await query(text, values);
    return rows[ 0 ];
  }

  /**
   * Fetch one admin by mobile number.
   * @param {string} mobile
   * @returns {Promise<Object|null>}
   */
  static async findByMobile(mobile) {
    const text = `
      SELECT *
      FROM ${TABLE}
      WHERE mobile = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [ mobile ]);
    return rows[ 0 ] || null;
  }

  /**
   * Fetch one admin by email address.
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const text = `
      SELECT *
      FROM ${TABLE}
      WHERE email = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [ email ]);
    return rows[ 0 ] || null;
  }

  /**
   * Update the pin_hash column for a specific admin ID.
   * @param {string} id
   * @param {string} pinHash
   * @returns {Promise<void>}
   */
  static async updatePinHash(id, pinHash) {
    const text = `
      UPDATE ${TABLE}
      SET pin_hash = $2
      WHERE id = $1
    `;
    await query(text, [ id, pinHash ]);
  }

  /**
   * Update the pin_hash column for a specific mobile number.
   * @param {string} mobile
   * @param {string} pinHash
   * @returns {Promise<void>}
   */
  static async updatePinHashByMobile(mobile, pinHash) {
    const text = `
      UPDATE ${TABLE}
      SET pin_hash = $2
      WHERE mobile = $1
    `;
    await query(text, [ mobile, pinHash ]);
  }

  /**
   * Generic update for any admin fields.
   * @param {string} id
   * @param {Object} fields  e.g. { name, email }
   * @returns {Promise<Object>} the updated row
   */
  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.findById(id);

    const sets = keys
      .map((k, i) => `${k} = $${i + 2}`)
      .join(', ');
    const values = [ id, ...keys.map((k) => fields[ k ]) ];

    const text = `
      UPDATE ${TABLE}
      SET ${sets}
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await query(text, values);
    return rows[ 0 ];
  }

  /**
   * (Optional) Fetch one admin by its PK.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const text = `
      SELECT *
      FROM ${TABLE}
      WHERE id = $1
      LIMIT 1
    `;
    const { rows } = await query(text, [ id ]);
    return rows[ 0 ] || null;
  }
}
