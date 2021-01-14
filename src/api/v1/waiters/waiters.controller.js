const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const waitersValidation = require('./waiters.validation');
const waiter = require(appRoot + '/src/model/waiter');

exports.getRestaurantWaiters = async (req, res) => {
  try {
    logger.info('In waiters - Validating get waiters');
    const { error } = waitersValidation.validateGetWaiters.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      logger.info(`Validation error ${JSON.stringify(error.details)}`);
      return res.status(400).json({
        message: 'Invalid Request. Please check and try again.',
        error: error.details,
      });
    }
    const { restaurant_id } = req.query;
    if (restaurant_id) {
      logger.info(`getting waiters of restaurant: ${restaurant_id}`);
      const restaurantWaiters = await waiter.find({ restaurant_id });
      return res.status(200).json({
        message: 'restaurant waiters data has been found successfully.',
        data: restaurantWaiters,
      });
    }
    logger.info(`getting all waiters`);
    const waiters = await waiter.find({});
    return res.status(200).json({
      message: 'Waiters data has been found successfully.',
      data: waiters,
    });
  } catch (error) {
    logger.error(JSON.stringify((error = error.stack)));
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: error,
    });
  }
};

exports.addRestaurantWaiters = async (req, res) => {
  try {
    logger.info('In waiters - Validating add waiter');
    const { error } = waitersValidation.validateAddWaiter.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.info(`Validation error ${JSON.stringify(error.details)}`);
      return res.status(400).json({
        message: 'Invalid Request. Please check and try again.',
        error: error.details,
      });
    }
    const { restaurant_id, full_name } = req.body;
    logger.info(`creating waiter of restaurant: ${restaurant_id}`);
    await waiter.create({
      restaurant_id,
      full_name,
    });
    logger.info(`successfully created waiter of restaurant: ${restaurant_id}`);
    return res.status(200).json({
      message: 'Waiter is successfully created',
    });
  } catch (e) {
    logger.error(JSON.stringify((error = error.stack)));
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: error,
    });
  }
};
