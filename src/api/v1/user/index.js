const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.post('/google-signup', userController.googleSignup);

module.exports = router;
