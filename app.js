/* eslint-disable prettier/prettier */

// Our Express app
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const appError = require('./utils/appError');
const path = require('path');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const globalErrorHandler = require('./controller/errorController.js');
const viewRouter = require('./routes/viewRouts');
const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, 'public')));
// 1) Global Middlewere

// Set security HTTP
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(function(req, res, next) {
//   res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" );
//   next();
// })

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
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

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
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  next(new appError(`Can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
