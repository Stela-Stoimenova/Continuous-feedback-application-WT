const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//POST /auth/signup -> create account and return JWT
router.post('/signup', authController.signUp);

//POST /auth/login  -> authenticate and return JWT
router.post('/login', authController.login);

module.exports = router;
