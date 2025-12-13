const activityService = require('../services/activityService');

module.exports = {
  async createActivity(req, res) {
    try {
      const professor_id = req.user.id;
      const activity = await activityService.createActivity({ ...req.body, professor_id });
      return res.status(201).json({ activity });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async getActivities(req, res) {
    try {
      const professor_id = req.user.id;
      const activities = await activityService.getActivities(professor_id);
      return res.status(200).json({ activities });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  async getActivityByCode(req, res) {
    try {
      const activity = await activityService.getActivityByCode(req.params.code);
      return res.status(200).json({ activity });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }
};
