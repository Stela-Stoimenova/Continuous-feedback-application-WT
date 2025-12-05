const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit feedback (students)
router.post('/', feedbackController.submitFeedback);

// Get all feedbacks for an activity (professor)
router.get('/:activityId', feedbackController.getFeedbacks);

module.exports = router;
