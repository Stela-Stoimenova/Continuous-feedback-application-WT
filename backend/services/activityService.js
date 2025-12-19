const { Activity } = require('../models');

module.exports = {
  async createActivity({ access_code, starts_at, ends_at, professor_id }) {
    if (!access_code || !starts_at || !ends_at) throw new Error('Missing required fields');

    const existing = await Activity.findOne({ where: { access_code } });
    if (existing) throw new Error('Access code already exists');

    const activity = await Activity.create({ access_code, starts_at, ends_at, professor_id });
    return activity;
  },

  async getActivities(professor_id) {
    return await Activity.findAll({ where: { professor_id } });
  },

  async getActivityByCode(code) {
    const activity = await Activity.findOne({ where: { access_code: code } });
    if (!activity) throw new Error('Activity not found');
    return activity;
  }
};
