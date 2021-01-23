const express = require('express');
const router = express.Router();
const waitersController = require('./waiters.controller');
const app = express();
router.get('/', waitersController.getRestaurantWaiters);

router.post('/addwaiter', waitersController.addRestaurantWaiters);

// app.get('/add-waiter', waitersController.addRestaurantWaiters);

module.exports = router;
