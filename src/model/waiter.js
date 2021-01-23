const mongoose = require('mongoose');
const schema = mongoose.Schema;
const appRoot = require('app-root-path');
const constant = require(appRoot + '/src/constant');

const waiRatingSchema = new schema({
  hospitality : {
    type : Number,
    min : 1,
    max : 5
  },
  rapidility : {
    type : Number,
    min : 1,
    max : 5
  },
  service : {
    type : Number,
    min : 1,
    max : 5
  },
  professionalism: {
    type : Number ,
    min : 1,
    max : 5
  },
  tip : {
    type : Number
  }
});

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
  rating : {
    type : waiRatingSchema
  }
});
waitersSchema.set('timestamps', true);
module.exports = mongoose.model('restaurant-waiters', waitersSchema);
