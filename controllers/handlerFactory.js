const catchAsync = require('../utils/catchasync');
const APIFeatures = require('../utils/apifeatures');
const AppError = require('../utils/appError');

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No tour found with that ID !!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {

console.log(req.body);
    const upTour = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        upTour,
      },
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const newTour = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });

exports.getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.params);
    let query = model.findById(req.params.id);

    if (popOptions) query = query.populate({ path: popOptions });

    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',

      data: {
        doc,
      },
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // TO ALLOW NESTED ROUTE IN REVIEWS

    let filter = {};
    if (req.params.tourId) filter = { tourRef: req.params.tourId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .pagination();

    // const tours = await features.query.explain();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      data: {
        tours,
      },
    });
  });
