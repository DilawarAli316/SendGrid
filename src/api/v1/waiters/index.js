const express = require('express');
const router = express.Router();
const waitersController = require('./waiters.controller');

router.get('/', waitersController.getRestaurantWaiters);

router.post('/add-waiter', waitersController.addRestaurantWaiters);

module.exports = router;
