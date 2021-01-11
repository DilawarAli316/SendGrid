const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appRoot = require('app-root-path');
const constant = require(appRoot + '/src/constant');

const waitersSchema = new schema({
  full_name: {
    type: String,
  },
  email: {
    type: String,
  },
  restaurant_id: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
  },
  picture: {
    type: String,
  },
  last_login_at: {
    type: String,
  },
});
waitersSchema.set('timestamps', true);
module.exports = mongoose.model('restaurant-waiters', waitersSchema);
