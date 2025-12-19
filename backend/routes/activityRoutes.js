const express = require('express');
const router = express.Router();

const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Validation rules
const createActivityValidation = [
  body('access_code').isLength({ min: 4, max: 10 }),
  body('starts_at').isISO8601(),
  body('ends_at').isISO8601()
];

// Create activity (PROFESSOR only)
router.post(
  '/',
  auth,
  role(['PROFESSOR']),
  validate(createActivityValidation),
  activityController.createActivity
);

// Get professor activities
router.get(
  '/',
  auth,
  role(['PROFESSOR']),
  activityController.getActivities
);

// Get activity by access code (public)
router.get('/:code', activityController.getActivityByCode);

module.exports = router;
