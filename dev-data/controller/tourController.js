/* eslint-disable prettier/prettier */

const { query } = require('express');
const Tour = require('../models/tourModel');
const appError = require('../utils/appError');
const APIFeatures = require(`./../utils/apiFeatures.js`);
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-ratingAverag'),
    (req.query.fields = 'name,price,ratingAverag,summary,difficulty');
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  // Send Response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getATour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findById(req.params.id);

  if (!tours) {
    return next(new appError('No tour find with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.patchTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tours) {
    return next(new appError('No tour find with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findByIdAndDelete(req.params.id);

  if (!tours) {
    return next(new appError('No tour find with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    message: 'Tour successfully removed'
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverag' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
