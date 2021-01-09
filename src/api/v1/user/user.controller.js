const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constant = require(appRoot + '/src/constant');
const userValidation = require('./user.validation');
const User = require(appRoot + '/src/model/user');
const userUtil = require('./util/user.util');

exports.getUsers = async (req, res) => {
  try {
    logger.info('In Users - Validating users');
    const { error } = userValidation.validateGetUsersData.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      logger.info(`Validation error ${JSON.stringify(error.details)}`);
      return res.status(400).json({
        message: 'Invalid Request. Please check and try again.',
        error: error.details,
      });
    }
    logger.info('All validations passed');
    logger.info(`calling [buildQuery] to build query for users`);
    const query = await queryBuildUtil.buildQuery(req.query);
    const sortedBy = req.query.sort_by;
    const order = parseInt(req.query.order);
    const sortByUser = { [sortedBy]: order };
    logger.info(
      `calling [getUsers] to get users against query ${JSON.stringify(query)}`,
    );
    const users = await userUtil.getUsers(req.query, query, sortByUser);
    logger.info(`${users.length} users exists of the requested platform`);
    const countUsers = await User.countDocuments(query);
    if (users.length) {
      for (let user of users) {
        logger.info(
          `calling [populateUserData] to populate user data against ${user._id}`,
        );
        user = await userUtil.populateUserData(user, req.query);
      }
      logger.info('Returning back Users data with success code 200');
      return res.status(200).json({
        message: ' Users data has been found successfully.',
        total_number_of_users: countUsers,
        page_no: req.query.page_no,
        records_per_page: req.query.records_per_page,
        data: users,
      });
    } else {
      return res.status(404).json({
        message: `Sorry, we couldn't find any user for this platform.`,
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

exports.googleSignup = async (req, res) => {
  try {
    logger.info('In Users - Validating google users');
    const { error } = userValidation.validateGoogleSignup.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.info(`Validation error ${JSON.stringify(error.details)}`);
      return res.status(400).json({
        message: 'Invalid Request. Please check and try again.',
        error: error.details,
      });
    }
    logger.info('All validations passed');
    logger.info('Destructing req.body');
    const { id } = req.body;
    const isUser = await userUtil.isGoogleUserStored(id);
    if (!isUser) {
      await userUtil.addGoogleUserInDb(req.body);
    }
    logger.info('User signed In');
  } catch (error) {
    logger.error(JSON.stringify((error = error.stack)));
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: error,
    });
  }
};
