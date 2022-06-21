/* eslint-disable prettier/prettier */

// Virtual Enviornmaent
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//Mongoose server handeling
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(
    DB, {useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Server Connected'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});