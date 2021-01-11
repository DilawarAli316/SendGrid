const express = require('express');
const router = express.Router();
const path = require('path');
const users = require('./user');
const restaurants = require('./restaurants');
const waiters = require('./waiters');

router.use('/users', users);
router.use('/restaurants', restaurants);
router.use('/restaurant-waiters', waiters);
module.exports = router;
