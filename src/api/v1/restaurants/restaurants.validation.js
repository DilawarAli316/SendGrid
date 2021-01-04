const Joi = require('@hapi/joi');

exports.validateGetRestaurantsData = Joi.object({
  location: Joi.number().optional(),
  language: Joi.number().optional(),
});
