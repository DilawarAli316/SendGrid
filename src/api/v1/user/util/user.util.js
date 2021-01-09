const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constant = require(appRoot + '/src/constant');
const User = require(appRoot + '/src/model/user');

module.exports = {
  // In this method we will get users against query
  getUsers: async (params, query, sortByUser) => {
    try {
      const skipPage = parseInt(params.page_no) - 1;
      const limitPage = parseInt(params.records_per_page);
      const skipDocuments = skipPage * limitPage;
      let users = [];
      if (params.page_no && params.records_per_page) {
        users = await User.find(query)
          .skip(skipDocuments)
          .limit(limitPage)
          .sort(sortByUser);
      } else {
        users = await User.find(query).sort(sortByUser);
      }
      return users;
    } catch (error) {
      logger.error(JSON.stringify((error = error.stack)));
      return [];
    }
  },
  // Is Google user in DB
  isGoogleUserStored: async (id) => {
    try {
      logger.info('Searching user in database');
      let isAvailable = await User.findOne({ google_id: id });
      logger.info(`User availability:${isAvailable}`);
      return isAvailable;
    } catch (error) {
      logger.error(JSON.stringify((error = error.stack)));
      return false;
    }
  },
  // Create google user in database
  addGoogleUserInDb: async ({
    email,
    family_name,
    given_name,
    name,
    id,
    locale,
    picture,
    verified_email,
  }) => {
    try {
      logger.info('adding user in database');
      await User.create({
        email,
        family_name,
        given_name,
        full_name: name,
        google_id: id,
        locale,
        picture,
        verified_email,
      });
    } catch (error) {
      logger.error(JSON.stringify((error = error.stack)));
      return `user creating error ${error}`;
    }
  },
};
