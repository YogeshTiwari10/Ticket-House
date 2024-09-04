const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheatreSchema = new Schema(
  {
    name: String,
    address1: String,
    city: String,
    zipcode: String,
    State: String,
    country: String,
    contact: String,
  },
  { collection: 'theatres' }
);

module.exports = TheatreSchema;
