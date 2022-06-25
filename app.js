/* eslint-disable prettier/prettier */

// Our Express app
const express = require('express');
const app = express();
const morgan = require('morgan');
const appError = require('./dev-data/utils/appError');
const globalErrorHandler = require('./dev-data/controller/errorController.js');

const tourRouter = require('./dev-data/routes/tourRouts');
const userRouter = require('./dev-data/routes/userRouts');

// 1) Middlewere
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static('{__dirname}./public'));

app.use((req,res,next)=>{
  req.requestTime = new Date().toISOString();
  next();
})

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
