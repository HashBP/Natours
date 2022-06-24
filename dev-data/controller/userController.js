/* eslint-disable prettier/prettier */

const express = require('express');
const fs = require('fs');

exports.tourDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Failed',
    message: 'No Route defined yet',
  });
};
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
