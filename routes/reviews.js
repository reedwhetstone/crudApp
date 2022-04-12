/** @format */

const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');

const Review = require('../models/review');
const Campground = require('../models/campground');

const { reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new expressError(message, 400);
  } else {
    next();
  }
  // console.log(result);
};

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // res.send(req.body)
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
