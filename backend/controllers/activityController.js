const { Activity, Feedback } = require('../models');
const { Op } = require('sequelize');

// Create a new feedback activity
module.exports = {
  async createActivity(req, res) {
    try {
      const { access_code, starts_at, ends_at } = req.body;
      const professor_id = req.user.id; // from JWT

      if (!access_code || !starts_at || !ends_at) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if access code exists
      const existing = await Activity.findOne({ where: { access_code } });
      if (existing) return res.status(400).json({ message: 'Access code already exists' });

      const activity = await Activity.create({ access_code, starts_at, ends_at, professor_id });
      return res.status(201).json({ activity });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getActivities(req, res) {
    try {
      const professor_id = req.user.id;
      const activities = await Activity.findAll({ where: { professor_id } });
      return res.status(200).json({ activities });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getActivityByCode(req, res) {
    try {
      const { code } = req.params;
      const activity = await Activity.findOne({ where: { access_code: code } });
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      return res.status(200).json({ activity });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
