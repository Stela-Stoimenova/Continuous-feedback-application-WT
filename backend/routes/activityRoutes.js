const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, activityController.createActivity);
router.get('/:code', activityController.getActivityByCode);
router.get('/professor/list', authMiddleware, activityController.getActivitiesByProfessor);

module.exports = router;
