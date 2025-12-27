
// Handles anonymous feedback submission and professor feedback retrieval via `feedbackService`.

const feedbackService = require('../services/feedbackService');

module.exports = {
  
  //Submit feedback for an activity.
  // Body: { activity_id, emotion_type, anonymous_session_id }
  // Returns: 201 with created `feedback` or 400 on validation/service errors.
  async submitFeedback(req, res) {
    try {
      const feedback = await feedbackService.submitFeedback(req.body);
      
      // emit socket.io event after creating feedback
      const io = req.app.get('io');
      io.to(activity_id.toString()).emit('new-feedback', {
        feedback: feedback,
        timestamp: new Date()
      });
      
      return res.status(201).json({ feedback });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // List feedbacks for a given activity (professor-only route).
  // Path param: `activityId`
  // Returns: 200 with `feedbacks` array or 500 on unexpected errors.
  async getFeedbacks(req, res) {
    try {
      const feedbacks = await feedbackService.getFeedbacks(req.params.activityId);
      return res.status(200).json({ feedbacks });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};
