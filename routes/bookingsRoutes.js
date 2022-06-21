const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(authController.protect);

Router.get('/checkout-session/:tourId', bookingsController.getCheckoutSession);

Router.use(authController.restrictTo('admin', 'lead-guide'));

Router.route('/')
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createBooking);

Router.route('/:id')
  .get(bookingsController.getBooking)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

module.exports = Router;
