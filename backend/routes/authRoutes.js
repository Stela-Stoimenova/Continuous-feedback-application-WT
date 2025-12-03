const express = require('express');
const router=express.Router();
const authController = require('../controllers/authController');

//SignUp: create a new professor or student account
//Login: authenticate a user and return a JWT token
router.post('/SignUp', authController.signUp);
router.post('/Login', authController.login);
module.exports=router;