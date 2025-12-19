const { Feedback, Activity } = require('../models');

module.exports = {
  async submitFeedback({ activity_id, emotion_type, anonymous_session_id }) {
    const activity = await Activity.findByPk(activity_id);
    if (!activity) throw new Error('Activity not found');

    if (![1, 2, 3, 4].includes(emotion_type)) throw new Error('Invalid emotion type');

    const feedback = await Feedback.create({ activity_id, emotion_type, anonymous_session_id });
    return feedback;
  },

  async getFeedbacks(activityId) {
    return await Feedback.findAll({ where: { activity_id: activityId } });
  }
};
