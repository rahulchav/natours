const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchasync');
const factory = require('./handlerFactory');

exports.setToursAndUserIds = (req, res, next) => {
  if (!req.body.tourRef) req.body.tourRef = req.params.tourId;
  if (!req.body.userRef) req.body.userRef = req.user.id;
  next();
};

exports.getallreview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.dltReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
