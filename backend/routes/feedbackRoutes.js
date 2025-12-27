const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Submit feedback (public / anonymous)
router.post(
  '/',
  validate([
    body('activity_id').isUUID(),
    body('emotion_type').isInt({ min: 1, max: 4 })
  ]),
  feedbackController.submitFeedback
);

// Get feedbacks (PROFESSOR only)
router.get(
  '/:activityId',
  auth,
  role(['PROFESSOR']),
  feedbackController.getFeedbacks
);

module.exports = router;
