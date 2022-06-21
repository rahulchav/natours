const express = require('express');

const Router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//
// //////

// const upload = multer({ dest: 'public/img/users' });

Router.post('/signup', authController.signup); //OR
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);
Router.post('/forgetPassword', authController.forgetPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
Router.use(authController.protect);

Router.patch('/updatePassword', authController.updatePassword);

Router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
Router.delete('/deleteMe', userController.deleteMe);
Router.get('/Me', userController.getMe, userController.oneUser);

Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
Router.route('/:id')
  .get(userController.oneUser)
  .delete(userController.dltUser)
  .patch(userController.updateUser);

module.exports = Router;
