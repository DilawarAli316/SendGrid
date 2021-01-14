const Joi = require('@hapi/joi');

exports.validateGetWaiters = Joi.object({
  page_no: Joi.number().optional(),
  records_per_page: Joi.number().optional(),
  sort_by: Joi.string().optional(),
  restaurant_id: Joi.string().optional(),
});

exports.validateAddWaiter = Joi.object({
  restaurant_id: Joi.string().required(),
  full_name: Joi.string().required(),
});
