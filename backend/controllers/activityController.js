/**
 * Activity Controller
 * Thin HTTP layer that delegates to `activityService`.
 * Assumes `req.user` is populated by `authMiddleware` and roles checked by `roleMiddleware`.
 */
const activityService = require('../services/activityService');

module.exports = {
  /**
   * Create a new activity for the authenticated professor.
   * Body: { access_code, starts_at, ends_at }
   * Returns: 201 with created `activity` or 400 on validation/service errors.
   */
  async createActivity(req, res) {
    try {
      const professor_id = req.user.id;
      const activity = await activityService.createActivity({ ...req.body, professor_id });
      return res.status(201).json({ activity });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  /**
   * List activities owned by the authenticated professor.
   * Returns: 200 with `activities` array or 500 on unexpected errors.
   */
  async getActivities(req, res) {
    try {
      const professor_id = req.user.id;
      const activities = await activityService.getActivities(professor_id);
      return res.status(200).json({ activities });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  /**
   * Fetch a single activity by public access code.
   * Path param: `code`
   * Returns: 200 with `activity` or 404 if not found.
   */
  async getActivityByCode(req, res) {
    try {
      const activity = await activityService.getActivityByCode(req.params.code);
      return res.status(200).json({ activity });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }
};
