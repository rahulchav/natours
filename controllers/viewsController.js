const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchasync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1 get data from collection
  const tours = await Tour.find();
  // 2 build template
  // 3 render that template using data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const [tour] = await Tour.find({ slug: req.params.slug }).populate('reviews');

  // console.log(process.env);

  if (!tour) {
    return next(new AppError('There is no tour with that name!!', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: tour,
  });
});

exports.login = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in to your Account',
  });
};

exports.myAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
};

exports.getMyTours = async (req, res, next) => {
  // 1 find all bookings
  const tours = await Booking.find({ user: req.user.id });
  console.log(tours.length);

  const tourId = tours.map((el) => el.tour);
  const tour = await Tour.find({ _id: { $in: tourId } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours: tour,
  });
};
