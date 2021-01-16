const Joi = require('@hapi/joi');

exports.validateGetRestaurantsData = Joi.object({
  location: Joi.any().optional(),
  language: Joi.number().optional(),
  search: Joi.string().optional(),
});
