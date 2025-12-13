const feedbackService = require('../services/feedbackService');

module.exports = {
  async submitFeedback(req, res) {
    try {
      const feedback = await feedbackService.submitFeedback(req.body);
      return res.status(201).json({ feedback });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async getFeedbacks(req, res) {
    try {
      const feedbacks = await feedbackService.getFeedbacks(req.params.activityId);
      return res.status(200).json({ feedbacks });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};
