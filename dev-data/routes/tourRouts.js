/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const fileController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const reviewRouter = require('../routes/reviewRouts');

// router.param('id', fileController.checkID);
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-tours')
  .get(fileController.aliasTopTours, fileController.getAllTours);
  
router.route('/tour-stats').get(fileController.getTourStats);

router
  .route('/')
  .get(fileController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    fileController.createNewTour
  );

router
  .route('/:id')
  .get(fileController.getATour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    fileController.patchTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    fileController.deleteTour
  );

router.route('/:id').delete(reviewController.deleteReview);
module.exports = router;
