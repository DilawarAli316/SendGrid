const Joi = require('@hapi/joi');

exports.validateGetRestaurantsData = Joi.object({
  location: Joi.any().required(),
  language: Joi.number().optional(),
});
