/** @format */

const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const expressError = require('./utilities/expressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in.');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user.id)) {
    req.flash('error', 'You are missing the required permissions for this action.');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash('error', 'You are missing the required permissions for this action.');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new expressError(message, 400);
  } else {
    next();
  }
  // console.log(result);
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new expressError(message, 400);
  } else {
    next();
  }
  // console.log(result);
};
