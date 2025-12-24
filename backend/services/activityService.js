/**
 * Activity Service
 * Encapsulates business logic for activities.
 * Validates inputs, enforces unique `access_code`, and interacts with the Activity model.
 */
const { Activity } = require('../models');

module.exports = {
  /**
   * Create a new activity.
   * Params: { access_code, starts_at, ends_at, professor_id }
   * Throws: Error on missing fields or duplicate access_code.
   * Returns: Created Activity instance.
   */
  async createActivity({ access_code, starts_at, ends_at, professor_id }) {
    if (!access_code || !starts_at || !ends_at) throw new Error('Missing required fields');

    const existing = await Activity.findOne({ where: { access_code } });
    if (existing) throw new Error('Access code already exists');

    const activity = await Activity.create({ access_code, starts_at, ends_at, professor_id });
    return activity;
  },

  /**
   * List activities owned by a professor.
   */
  async getActivities(professor_id) {
    return await Activity.findAll({ where: { professor_id } });
  },

  /**
   * Find an activity by its public access code.
   * Throws: Error if not found.
   */
  async getActivityByCode(code) {
    const activity = await Activity.findOne({ where: { access_code: code } });
    if (!activity) throw new Error('Activity not found');
    return activity;
  }
};
