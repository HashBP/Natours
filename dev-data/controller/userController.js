/* eslint-disable prettier/prettier */

const express = require('express');
const fs = require('fs');
const User = require('../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { resetPassword } = require('./authController');
const factory = require('./handlerFactory');

exports.tourDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1.Create error if user POSTs resetPassword.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'This route is not for password updates. Please use updateMyPassword'
      ),
      400
    );
  }
  // 2.Update other documents
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    user: updatedUser
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
  next();
});

exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}

exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getAUser = factory.getOne(User);
exports.createNewUser = factory.createOne(User);
exports.patchUser = factory.patchOne(User);
