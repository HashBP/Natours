const appError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new appError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // console.log(err);
  const value = err.message.match(/([""])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new appError(message, 400);
};

const handleValidationErrorDB=err=>{
    console.log(process.env.NODE_ENV)
    const errors=Object.values(err.errors).map(el=>el.message);
    const message=`Invalid Input Data. ${errors.join('. ')}`;
    return new appError(message,400)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // console.log(process.env)
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    console.log(error)
    if (error.errors.name === 'ValidatorError') error = handleValidationErrorDB(error);
  }
};
