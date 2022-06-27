/* eslint-disable prettier/prettier */
const express = require('express');
const fileController = require('../controller/userController');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updateMyPassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', fileController.getAllUsers);
router.get('/users', fileController.getAllUsers);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router
  .route('/')
  .get(fileController.getAllUsers)
  .post(fileController.createNewUser);
router
  .route('/:id')
  .get(fileController.getAUser)
  .patch(fileController.patchUser);

module.exports = router;
