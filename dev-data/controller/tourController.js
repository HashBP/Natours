/* eslint-disable prettier/prettier */

const Tour = require('../models/tourModel');

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tourDetails.length) {
//     return res.status(404).json({
//       status: 'Failed',
//       message: 'Incorrect Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     res.status(404).json({
//       status: 'Failed',
//       messgae: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: 'Error!!',
    });
  }
};

exports.getATour = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      messge: 'Error',
    });
  }
};

exports.createNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      messge: 'Error',
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      newValidators:true
    });
    res.status(200).json({
      status: 'success',
      message: '<Some updated data here>',
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      messge: 'Error',
    });
  }
};
