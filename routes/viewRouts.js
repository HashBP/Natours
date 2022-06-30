const express = require('express');
const router = express.Router();
const viewController=require('../controller/viewController')
const authController=require('../controller/authController')

router.get('/',authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLoggedIn,authController.protect,viewController.getTour);
// router.get('/tour/:slug',viewController.getTour);
router.get('/login',authController.isLoggedIn,viewController.getLoginPage);
router.get('/me',authController.protect,viewController.getAccount)
router.post('/submit-user-data',viewController.updateUserData);

module.exports = router;
