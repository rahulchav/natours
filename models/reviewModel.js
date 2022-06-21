// review /rating /createdAt/ ref of tour/ ref of user

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
  },

  rating: {
    type: Number,
    default: 0,
    min: [1, 'The rating must be above 1.0'],
    max: [5, 'The rating must be below 5.0'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  userRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reviews must belongs to a user'],
  },

  tourRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Reviews must belongs to a tour'],
  },
});

// reviewSchema.index({ tourRef: 1, userRef: 1 }, { unique: true });

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'userRef',
//     select: 'name photo ',
//   }).populate({
//     path: 'tourRef',
//     select: 'name',
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userRef',
    select: 'name photo ',
  });
  next();
});

// this method will for the model same as the instance methods available for all documents

reviewSchema.statics.caclAvgRatings = async function (tourId) {
  // this is modle in this case
  const stats = await this.aggregate([
    {
      $match: { tourRef: tourId },
    },
    {
      $group: {
        _id: '$tourRef',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review

  // this dot constructor points to the model Review bcox Review is declared after this middleware
  this.constructor.caclAvgRatings(this.tourRef);
  // Review.caclAvgRatings(this.tourRef);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.caclAvgRatings(this.r.tourRef);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
