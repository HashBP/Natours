/* eslint-disable prettier/prettier */
const express = require('express');
const fileController = require('../controller/userController');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getAUser);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/users', fileController.getAllUsers);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(fileController.getAllUsers)
  .post(fileController.createNewUser);
router
  .route('/:id')
  .get(fileController.getAUser)
  .patch(fileController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
