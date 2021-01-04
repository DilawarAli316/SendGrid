const axios = require('axios');
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constants = require(appRoot + '/src/constant');

exports.getRestaurantByGoogleApi = async (
  location = { lat: '24.8608', log: '67.0104' },
  language = 'fr',
  pagetoken = '',
) => {
  try {
    logger.info(`calling restaurants from google api`);
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          types: 'bar|restaurant|night_club|cafe',
          key: constants.GOOGLE_API_KEY,
          location: `${location.lat},${location.log}`,
          radius: 10000,
          language,
          pagetoken,
        },
      },
    );
    logger.info(`succesfully get restaurants`);
    logger.info(`modifying places according to our needs`);
    let places = { next_page_token: data.next_page_token };
    data.results.forEach((place) => {
      const { geometry: { location: { lat = '', log = '' } = {} } = {} } =
        place || {};
      places.results = [
        {
          ...place,
          distance: getDistanceFromLatLonInKm(
            location.lat,
            location.log,
            lat,
            log,
          ),
        },
        ...(places.results || []),
      ];
    });

    return places;
  } catch (error) {
    logger.error(JSON.stringify(error));
    console.log(error);
    return 'error';
  }
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d.toFixed(3);
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
