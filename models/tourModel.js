/* eslint-disable prettier/prettier */

const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const catchAsync = require('./../utils/catchAsync');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A tour name should be present'],
      trim: true,
      maxlength: [40, 'A tour name must be smallen then 40'],
      minlength: [10, 'A tour name must be greater then 10']
      // validate:[validator.isAlpha,'Tour name must only contains characters.']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium or difficult'
      }
    },
    ratingAverag: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be less then 5'],
      set: val => Math.round(val * 10) / 10
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    priceDiscount: {
      type: Number,
      validate: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Summary should be provided']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A cover must have some Text']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

tourSchema.index({ price: 1, ratingAverag: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//Document Middleware : runs before .save() and .create()
// tourSchema.pre('save',async function(next) {
//   const guidePromises=this.guides.map(async id=>await User.findById(id));
//   this.guides=await Promise.all(guidePromises);
//   next();
// });

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});
// tourSchema.post('save', function(doc,next) {
//   console.log(doc);
//   next();
// });

// Query Middleware

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function(doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds.`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
