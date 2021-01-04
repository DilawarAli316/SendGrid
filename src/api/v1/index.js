const express = require('express');
const router = express.Router();
const path = require('path');
const users = require('./user');
const restaurants = require('./restaurants');
router.use('/users', users);
router.use('/restaurants', restaurants);

module.exports = router;
