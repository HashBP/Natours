/* eslint-disable prettier/prettier */
const express = require('express');

const app = express();
const morgan = require('morgan');

const tourRouter = require('./dev-data/routes/tourRouts');
const userRouter = require('./dev-data/routes/userRouts');

// 1) Middlewere
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static('./public'));

// 2)Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
