const axios = require('axios');
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constants = require(appRoot + '/src/constant');

exports.getRestaurantByGoogleApi = async (
  location = { lat: '24.8608', log: '67.0104' },
  language = 'fr',
) => {
  try {
    let places = {};
    const data = await getRestaurantsData({
      location,
      language,
      pagetoken: places.next_page_token,
    });
    logger.info(`modifying places according to our needs`);
    places = { next_page_token: data.next_page_token, ...places };
    for (p in data.results) {
      const place = data.results[p];
      const {
        geometry: { location: { lat = '', log = '' } = {} } = {},
        photos = [],
      } = place || {};
      const photoReferences = photos.map(
        (photo) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${400}&key=${
            constants.GOOGLE_API_KEY
          }&photoreference=${photo.photo_reference}`,
      );
      places.results = [
        {
          ...place,
          distance: getDistanceFromLatLonInKm(
            location.lat,
            location.log,
            lat,
            log,
          ),
          photos: photoReferences,
        },
        ...(places.results || []),
      ];
    }

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

const getRestaurantsData = async ({ location, language, pagetoken }) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          types: 'restaurant',
          key: constants.GOOGLE_API_KEY,
          location: `${location.lat},${location.log}`,
          radius: 1000,
          language,
          ...(pagetoken && { pagetoken }),
          opennow: true,
        },
      },
    );
    logger.info(`succesfully get restaurants`);
    return data;
  } catch (error) {
    logger.error(JSON.stringify(error));
    return {};
  }
};
