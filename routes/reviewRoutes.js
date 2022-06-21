const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const Router = express.Router({ mergeParams: true });

Router.use(authController.protect);

Router.route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.dltReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

Router.route('/')
  .get(reviewController.getallreview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setToursAndUserIds,
    reviewController.createReview
  );

module.exports = Router;
