const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

// GET /api/quote - fetch quote of the day
router.get('/quote', quoteController.getQuote);

module.exports = router;