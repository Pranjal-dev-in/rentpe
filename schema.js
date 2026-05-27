const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  guests: Joi.number().required().min(1).max(8),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  city: Joi.string().required(),
  amenities:Joi.array().required(),
  pincode: Joi.number().required(),
  country: Joi.string().required(),
}).required();

const reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
}).required();

module.exports = { listingSchema, reviewSchema };
