const { Activity, Feedback } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async createActivity(req, res) {
    try {
      const { starts_at, ends_at } = req.body;

      const access_code = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char code

      const activity = await Activity.create({
        professor_id: req.user.id,
        access_code,
        starts_at,
        ends_at
      });

      return res.status(201).json(activity);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getActivityByCode(req, res) {
    try {
      const { code } = req.params;

      const activity = await Activity.findOne({ where: { access_code: code } });

      if (!activity) return res.status(404).json({ message: 'Activity not found' });

      return res.status(200).json(activity);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getActivitiesByProfessor(req, res) {
    try {
      const activities = await Activity.findAll({ where: { professor_id: req.user.id } });
      return res.status(200).json(activities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
