const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");
const expressError = require("./utils/expressError.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
}

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

const isOwned = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!res.locals.currUser._id.equals(list.owner._id)) {
    throw new expressError(403, "Access denied");
  }
  next();
};

const isWritten = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!res.locals.currUser._id.equals(review.written._id)) {
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports = {
  validateListing,
  validateReview,
  isLoggedIn,
  saveRedirectUrl,
  isOwned,
  isWritten,
};
