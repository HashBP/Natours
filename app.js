/* eslint-disable prettier/prettier */

// Our Express app
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const appError = require('./dev-data/utils/appError');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = requre('xss-clean');
const helmet = require('helmet');
const globalErrorHandler = require('./dev-data/controller/errorController.js');

const tourRouter = require('./dev-data/routes/tourRouts');
const userRouter = require('./dev-data/routes/userRouts');

// 1) Global Middlewere
// Set security HTTP
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  nessage:
    'Too meany requests from this IP, Please wait for a hour before making another request.'
});
app.use('/api', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Serving static files
app.use(express.static('{__dirname}./public'));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// 2)Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  next(new appError(`Can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
