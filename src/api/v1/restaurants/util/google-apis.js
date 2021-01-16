const axios = require('axios');
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constants = require(appRoot + '/src/constant');
const waiter = require(appRoot + '/src/model/waiter.js');

exports.getRestaurantByGoogleApi = async ({
  location = { lat: '24.8608', log: '67.0104' },
  language = 'fr',
  next_page_token,
  search,
}) => {
  try {
    let places = {},
      data = [];
    if (!search) {
      data = await getRestaurantsData({
        location,
        language,
        pagetoken: next_page_token,
      });
    } else {
      data = await searchRestaurantsData({
        location,
        language,
        search,
        pagetoken: next_page_token,
      });
    }

    logger.info(`modifying places according to our needs`);
    places = { next_page_token: data.next_page_token, ...places };
    for (p in data.results) {
      const place = data.results[p];
      const { place_id, photos = [] } = place || {};
      const photoReferences = photos.map(
        (photo) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${400}&key=${
            constants.GOOGLE_API_KEY
          }&photoreference=${photo.photo_reference}`,
      );
      const distance = await getDistanceFromLatLonInKm(
        location.lat,
        location.log,
        place_id,
      );
      const servers = await waiter.countDocuments({ restaurant_id: place_id });
      places.results = [
        {
          ...place,
          distance,
          photos: photoReferences,
          servers,
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

const getDistanceFromLatLonInKm = async (lat1, lon1, place_id) => {
  try {
    logger.info(
      `Calculating distance between current location:${
        (lat1, lon1)
      } and restaurant id:${place_id}!`,
    );

    const { data } = await axios.get(
      `http://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          key: constants.GOOGLE_API_KEY,
          origins: `${lat1},${lon1}`,
          destinations: {
            place_id,
          },
        },
      },
    );
    logger.info('successfully got the distance!');
    return data;
  } catch (error) {
    logger.error(JSON.stringify(error));
    return {};
  }
};

const getRestaurantsData = async ({ location, language, pagetoken }) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          type: 'restaurant',
          key: constants.GOOGLE_API_KEY,
          location: `${location.lat},${location.log}`,
          radius: 1000,
          language,
          ...(pagetoken && { pagetoken }),
          opennow: true,
        },
      },
    );
    logger.info(`successfully get restaurants`);
    return data;
  } catch (error) {
    logger.error(JSON.stringify(error));
    return {};
  }
};

const searchRestaurantsData = async ({
  location,
  language,
  search,
  pagetoken,
}) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          type: 'restaurant',
          key: constants.GOOGLE_API_KEY,
          query: search,
          language,
          location: `${location.lat},${location.log}`,
          radius: 1000,
          opennow: true,
          ...(pagetoken && { pagetoken }),
        },
      },
    );
    logger.info(`successfully searched restaurants`);
    return data;
  } catch (error) {
    logger.error(JSON.stringify(error));
    return {};
  }
};
