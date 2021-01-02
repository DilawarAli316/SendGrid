const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appRoot = require('app-root-path');
const constant = require(appRoot + '/src/constant');

const userSchema = new schema({
  full_name: {
    type: String,
  },
  user_id: {
    type: String,
  },
  password: {
    type: String,
  },
  role_id: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  gender: {
    type: String,
  },
  country_code: {
    type: String,
  },
  status: {
    type: String,
    default: constant.USER_STATUSES.STATUS_REGISTERED,
  },
  last_login_at: {
    type: String,
  },
  picture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'storage_files',
  },
  address: {
    type: String,
  },
});
userSchema.set('timestamps', true);
module.exports = mongoose.model('user', userSchema);
