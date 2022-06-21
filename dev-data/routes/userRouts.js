/* eslint-disable prettier/prettier */
const express = require('express');
const fileController = require('../controller/userController');

const router = express.Router();

router
  .route('/')
  .get(fileController.getAllUsers)
  .post(fileController.createNewUser);
router
  .route('/:id')
  .get(fileController.getAUser)
  .patch(fileController.patchUser);

module.exports = router;
