/* eslint-disable prettier/prettier */

const express = require('express');
const fs = require('fs');
const User=require('../models/userModel')
const catchAsync=require('../utils/catchAsync')

exports.tourDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

exports.getAllUsers =catchAsync(async(req, res,next) => {
  const users=await User.find();

  res.status(200).json({
    status: 'Success',
    results:users.length,
    data:{
      users
    }
  });
});
exports.getAUser = (req, res) => {
  res.status(500).json({
    status: 'Failed',
    message: 'No Route defined yet',
  });
};
exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'Failed',
    message: 'No Route defined yet',
  });
};
exports.patchUser = (req, res) => {
  res.status(500).json({
    status: 'Failed',
    message: 'No Route defined yet',
  });
};
