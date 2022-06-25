/* eslint-disable prettier/prettier */

// Virtual Enviornmaent
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//Mongoose server handeling
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception!!!');
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB Server Connected'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection!!!');

  server.close(() => {
    process.exit(1);
  });
});
