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
      logger.info(`searching waiters of restaurant: ${restaurant_id}`);

      return res.status(200).json({
        message: ' Users data has been found successfully.',
        data: users,
      });
    }
  } catch (error) {
    logger.error(JSON.stringify((error = error.stack)));
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: error,
    });
  }
};
