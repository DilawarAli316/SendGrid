const express = require('express');
const router = express.Router();
const waitersController = require('./waiters.controller');

router.post('/waiters', waitersController.getRestaurantWaiters);

module.exports = router;
