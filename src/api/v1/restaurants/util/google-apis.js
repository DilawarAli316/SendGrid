const axios = require('axios');
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constants = require(appRoot + '/src/constant');

exports.getRestaurantByGoogleApi = async (
  location = '24.8608,67.0104',
  language = 'en',
) => {
  try {
    logger.info(`calling restaurants from google api`);
    const neighborhood = 'chelsea';
    const borough = 'manhattan';
    const city = 'new+york+city';
    const category = 'burgers';
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&key=${constants.GOOGLE_API_KEY}&location=${location}&radius=10000`,
    );
    logger.info(`succesfully get restaurants`);
    return data;
  } catch (error) {
    logger.error(JSON.stringify((error = error.stack)));
    console.log(error);
    return 'error';
  }
};
