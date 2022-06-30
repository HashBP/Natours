const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log(req.params.slug);
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new appError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginPage=(req,res)=>{
  res.status(200).render('login',{
    title:'Log into your account'
  })
}

exports.getAccount=(req,res)=>{
  res.status(200).render('account',{
    title:'Your Account'
  })
}

exports.updateUserData = (req,res,next)=>{
  console.log('Hello',req.body)
}