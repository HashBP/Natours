/* eslint-disable prettier/prettier */

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour name should be present'],
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
