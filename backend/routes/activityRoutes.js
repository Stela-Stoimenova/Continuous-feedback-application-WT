const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new activity (professor only)
router.post('/', authMiddleware, activityController.createActivity);

// Get all activities for professor
router.get('/', authMiddleware, activityController.getActivities);

// Get activity by access code (student access)
router.get('/:code', activityController.getActivityByCode);

module.exports = router;
