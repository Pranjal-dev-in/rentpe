const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { validateReview, isLoggedIn, isWritten } = require("../middleware.js");

// Post review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newReview = new Review(req.body);
    newReview.written = res.locals.currUser;
    let list = await Listing.findById(id);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success", "review created");
    res.redirect(`/listing/${id}`);
  }),
);

// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isWritten,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review deleted!");
    res.redirect(`/listing/${id}`);
  }),
);

module.exports = router;
