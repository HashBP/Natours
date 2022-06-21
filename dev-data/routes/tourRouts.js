/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const fileController = require('../controller/tourController');

// router.param('id', fileController.checkID);

router
  .route('/')
  .get(fileController.getAllTours)
  .post(fileController.createNewTour);
router
  .route('/:id')
  .get(fileController.getATour)
  .patch(fileController.patchTour);

module.exports = router;
