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

exports.validateGoogleSignup = Joi.object({
  email: Joi.string().required(),
  family_name: Joi.string().optional(),
  given_name: Joi.string().optional(),
  name: Joi.string().required(),
  id: Joi.string().required(),
  locale: Joi.string().optional(),
  picture: Joi.string().optional(),
  verified_email: Joi.boolean().optional(),
});
