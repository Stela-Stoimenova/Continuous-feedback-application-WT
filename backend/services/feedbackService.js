/**
 * Feedback Service
 * Business logic for feedback submission and retrieval.
 * Validates `emotion_type` domain and ensures the activity exists.
 */
const { Feedback, Activity } = require('../models');

module.exports = {
  /**
   * Submit a feedback entry.
   * Params: { activity_id, emotion_type, anonymous_session_id }
   * Throws: Error if activity not found or emotion_type invalid.
   * Returns: Created Feedback instance.
   */
  async submitFeedback({ activity_id, emotion_type, anonymous_session_id }) {
    const activity = await Activity.findByPk(activity_id);
    if (!activity) throw new Error('Activity not found');

    if (![1, 2, 3, 4].includes(emotion_type)) throw new Error('Invalid emotion type');

    const feedback = await Feedback.create({ activity_id, emotion_type, anonymous_session_id });
    return feedback;
  },

  /**
   * List feedback entries for an activity.
   */
  async getFeedbacks(activityId) {
    return await Feedback.findAll({ where: { activity_id: activityId } });
  }
};
