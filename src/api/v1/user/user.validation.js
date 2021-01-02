const Joi = require('@hapi/joi');

exports.validateGetUsersData = Joi.object({
  page_no: Joi.number().optional(),
  records_per_page: Joi.number().optional(),
  role_id: Joi.string().optional(),
  status: Joi.string().optional(),
  sort_by: Joi.string().optional(),
  order: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  all: Joi.boolean().optional(),
  statuses: Joi.array().optional(),
});
