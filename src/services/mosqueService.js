// // src/services/mosqueService.js
import MosqueModel from "../models/mosqueModel.js";
import FacilityModel from "../models/facilityModel.js";

class MosqueService {
  /**
   * Create a new mosque for a given admin.
   * @param {string} adminId
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
   * @returns {Promise<Object>} The created mosque record
   */
  async createMosque(adminId, data) {
    const payload = {
      ...data,
      created_by_admin: adminId,
    };
    return MosqueModel.create(payload);
  }

  /**
   * Find the single mosque owned by the given admin.
   * @param {string} adminId
   * @returns {Promise<Object|null>} Mosque or null if none
   */
  async findByAdminId(adminId) {
    return MosqueModel.findByAdminId(adminId);
  }

  /**
   * Find a mosque by its ID.
   * @param {string} id
   * @returns {Promise<Object|null>} Mosque or null
   */
  async findById(id) {
    return MosqueModel.findById(id);
  }

  /**
   * Update arbitrary fields on a mosque.
   * @param {string} id
   * @param {Object} fields  e.g. { name, address_line, city, profile_completed }
   * @returns {Promise<Object>} Updated mosque record
   */
  async updateMosque(id, fields) {
    return MosqueModel.update(id, fields);
  }

  /**
   * Update only the status and optional review notes.
   * @param {string} id
   * @param {string} status          One of 'under_review', 'approved', 'rejected'
   * @param {string} [reviewNotes]
   * @returns {Promise<Object>} Updated mosque record
   */
  async updateStatus(id, status, reviewNotes = null) {
    return MosqueModel.updateStatus(id, status, reviewNotes);
  }
  /**
   * Update profile information: description, contact_phone, and facilities.
   * @param {string} id
   * @param {Object} params
   * @param {string} [params.description]
   * @param {string} [params.contact_phone]
   * @param {string[]} params.facilityIds
   */
  async updateProfile(
    id,
    { description = null, contact_phone = null, facilityIds = [] }
  ) {
    // 1. Update the mosques table
    await MosqueModel.update(id, { description, contact_phone });

    // 2. Update facilities join table
    await FacilityModel.setForMosque(id, facilityIds);

    // 3. Return the fresh mosque data + facilities
    const mosque = await MosqueModel.findById(id);
    const facilities = await FacilityModel.findByMosqueId(id);
    return { ...mosque, facilities };
  }

  async listAll() {
    return MosqueModel.findAll();
  }

  /**
 * Mark the profile as completed for a mosque.
 * @param {string} id
 * @returns {Promise<Object>} Updated mosque record
//  */
  //   async completeProfile(id) {
  //     return this.updateMosque(id, { profile_completed: true });
  //   }

  async completeProfile(id) {
    // 1) mark profile completed (if you have that flag)
    await MosqueModel.update(id, { profile_completed: true });

    // 2) mark fully approved
    return MosqueModel.markFullyApproved(id);
  }

  async updateStatus(mosqueId, status, review_notes = null) {
    // ensure mosque exists
    const existing = await this.findById(mosqueId);
    if (!existing) {
      const err = new Error("Mosque not found");
      err.status = 404;
      throw err;
    }
    return MosqueModel.updateStatus(mosqueId, status, review_notes);
  }
}

export default new MosqueService();
