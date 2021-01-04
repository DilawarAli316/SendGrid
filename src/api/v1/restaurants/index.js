const express = require('express');
const router = express.Router();
const restaurantController = require('./restaurants.controller');

router.get('/', restaurantController.getRestaurants);

module.exports = router;
