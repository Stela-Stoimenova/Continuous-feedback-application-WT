/**
 * Auth Routes
 * POST /auth/signup -> create account and return JWT
 * POST /auth/login  -> authenticate and return JWT
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

module.exports = router;
