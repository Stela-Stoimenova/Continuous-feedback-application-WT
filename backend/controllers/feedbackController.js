const { Feedback, Activity } = require('../models');

module.exports = {
  async submitFeedback(req, res) {
    try {
      const { activity_id, emotion_type, anonymous_session_id } = req.body;

      const activity = await Activity.findByPk(activity_id);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });

      const feedback = await Feedback.create({
        activity_id,
        emotion_type,
        anonymous_session_id
      });

      return res.status(201).json(feedback);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getFeedbackByActivity(req, res) {
    try {
      const { activityId } = req.params;
      const { since } = req.query;

      const where = { activity_id: activityId };
      if (since) where.created_at = { [require('sequelize').Op.gte]: new Date(since) };

      const feedbacks = await Feedback.findAll({ where, order: [['created_at', 'ASC']] });

      return res.status(200).json(feedbacks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
