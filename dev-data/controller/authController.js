const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const { token } = require('morgan');
const { exists } = require('./../models/userModel');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1. If email and pass exists.
  if (!email || !password) {
    return next(new appError('Please provide email and Password', 400));
  }

  //2. If user exists and password is correct.
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or Password!!', 401));
  }
  //3. If everything is ok send token to client.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get the token and check if present.

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new appError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2. Verify token.

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   console.log(decoded);

  // 3. Check if user exists.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exists.',
        401
      )
    );
  }
  // 4. If user change password after the token issued.
  if (currentUser.changePasswordAfter(decoded.id)) {
    return next(
      new appError(
        'User recently changed password!, Please log in again!!',
        401
      )
    );
  }
  //Grant access to the protected route..
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permisson to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  // 1. Get user based on token.
  console.log(req.params.token)
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 2. If token has not expired and there is a user , set new password.
  if (!user) {
    return next(new appError('Token is invalid or expired'), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpies = undefined;
  await user.save();
  // 3. Update changedPasswordAt property for the user.

  // 4.Log the user in and send JWT.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token
  });
};
