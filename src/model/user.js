const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appRoot = require('app-root-path');
const constant = require(appRoot + '/src/constant');

const userSchema = new schema({
  full_name: {
    type: String,
  },
  email: {
    type: String,
  },
  google_id: {
    type: String,
    required: true,
  },
  given_name: {
    type: String,
  },
  family_name: {
    type: String,
  },
  locale: {
    type: String,
  },
  picture: {
    type: String,
  },
  verified_email: {
    type: String,
  },
  status: {
    type: String,
    default: constant.USER_STATUSES.STATUS_REGISTERED,
  },
  last_login_at: {
    type: String,
  },
});
userSchema.set('timestamps', true);
module.exports = mongoose.model('user', userSchema);
