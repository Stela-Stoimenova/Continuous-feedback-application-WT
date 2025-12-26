const { Feedback, Activity } = require('../models');

// Submit feedback
module.exports = {
  async submitFeedback(req, res) {
    try {
      const { activity_id, emotion_type, anonymous_session_id } = req.body;

      // Check activity exists
      const activity = await Activity.findByPk(activity_id);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });

      // Check emotion_type
      if (![1, 2, 3, 4].includes(emotion_type)) {
        return res.status(400).json({ message: 'Invalid emotion type' });
      }

      const feedback = await Feedback.create({ activity_id, emotion_type, anonymous_session_id });
      
      // emit socket.io event after creating feedback
      const io = req.app.get('io');
      io.to(activity_id.toString()).emit('new-feedback', {
        feedback: feedback,
        timestamp: new Date()
      });
      
      return res.status(201).json({ feedback });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get feedbacks for a specific activity
  async getFeedbacks(req, res) {
    try {
      const { activityId } = req.params;
      const feedbacks = await Feedback.findAll({ where: { activity_id: activityId } });
      return res.status(200).json({ feedbacks });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
