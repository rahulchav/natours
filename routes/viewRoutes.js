const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingsController');

const Router = express.Router();

Router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLogedIn,
  viewController.getOverview
);
Router.get('/tours/:slug', authController.isLogedIn, viewController.getTour);
Router.get('/login', authController.isLogedIn, viewController.login);
Router.get('/signup',  viewController.signin);
Router.get('/me', authController.protect, viewController.myAccount);
Router.get('/myTours', authController.protect, viewController.getMyTours);

Router.post('/submit-user-data', viewController.updateUserData);
// Router.get('/signup',viewController.signup)

module.exports = Router;
