const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const mongoose = require("mongoose");
const User = require("../models/user.js");
const Listing = require("../models/listings.js");
const { validateListing, isLoggedIn, isOwned } = require("../middleware.js");
const multer = require("multer");

// Edit Username Route
router.patch("/:id/username", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const { username } = req.body;
  user.username = username;
  await user.save();
  res.redirect(`/profile/${id}`);
});

// Edit Profile Route
router.patch("/:id/detail", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const { fName, lName, ...rest } = req.body;
  user.bio = req.body.bio;
  user.location = req.body.location;
  user.phone = req.body.phone;
  const fullName =
    req.body.fName.trim().charAt(0).toUpperCase() +
    req.body.fName.slice(1) +
    " " +
    (req.body.lName.trim().charAt(0).toUpperCase() + req.body.lName.slice(1));
  if (user.name !== fullName) {
    user.name = fullName;
  }
  await user.save();
  res.redirect(`/profile/${id}`);
});
router.get("/:id/edit", (req, res) => {
  res.render("profile/editProfile.ejs", {
    file: "editProfile",
    user: res.locals.currUser,
  });
});

// Show Profile Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  let listings = await Listing.find({
    owner: user._id,
  }).populate("reviews");
  const joinTime = new Date(user.createdAt).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  res.render("profile/profile.ejs", {
    file: "profile",
    user,
    listings,
    joinTime,
  });
});

module.exports = router;
