/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const fileController = require('../controller/tourController');
const authController = require('../controller/authController');

// router.param('id', fileController.checkID);

router
  .route('/top-5-tours')
  .get(fileController.aliasTopTours, fileController.getAllTours);
router.route('/tour-stats').get(fileController.getTourStats);
router
  .route('/')
  .get(authController.protect, fileController.getAllTours)
  .post(fileController.createNewTour);
router
  .route('/:id')
  .get(fileController.getATour)
  .patch(fileController.patchTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin','lead-guide'), 
    fileController.deleteTour
  );

module.exports = router;
