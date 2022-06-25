/* eslint-disable prettier/prettier */
const express = require('express');
const fileController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', fileController.getAllUsers);
router.get('/users', fileController.getAllUsers);
router
  .route('/')
  .get( fileController.getAllUsers)
  .post(fileController.createNewUser);
router
  .route('/:id')
  .get( fileController.getAUser)
  .patch(fileController.patchUser);

module.exports = router;
