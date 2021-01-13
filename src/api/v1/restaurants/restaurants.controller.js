const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constant = require(appRoot + '/src/constant');
const restaurantsValidation = require('./restaurants.validation');
const googleApis = require('./util/google-apis');

exports.getRestaurants = async (req, res) => {
  try {
    logger.info('In Restaurants - Validating restaurants');
    const { error } = restaurantsValidation.validateGetRestaurantsData.validate(
      req.query,
      {
        abortEarly: false,
      },
    );
    if (error) {
      logger.info(`Validation error ${JSON.stringify(error.details)}`);
      return res.status(400).json({
        message: 'Invalid Request. Please check and try again.',
        error: error.details,
      });
    }

    logger.info('All validations passed');
    const { location, language = '' } = req.query;
    const restaurants = await googleApis.getRestaurantByGoogleApi(
      JSON.parse(location),
      language,
    );
    res.status(200).json({
      message: 'Restaurants data has been found successfully.',
      restaurants,
    });
  } catch (error) {
    logger.error(JSON.stringify((error = error.stack)));
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: error,
    });
  }
};
