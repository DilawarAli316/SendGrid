const express = require('express');
const router = express.Router();
const path = require('path');
const users = require('./user');

router.use('/users', users);

module.exports = router;
