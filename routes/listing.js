const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const { listingSchema } = require("../schema.js");
const { validateListing, isLoggedIn, isOwned } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
const axios = require("axios");

// My listing Route
router.get("/mylisting", isLoggedIn, async (req, res) => {
  let allListing = await Listing.find({
    owner: res.locals.currUser._id,
  });
  res.render("listing/myListing.ejs", { allListing });
});

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwned,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listing");
  }),
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwned,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listing/edit.ejs", { list, file: "form" });
  }),
);
router.put(
  "/:id",
  isLoggedIn,
  isOwned,
  upload.array("newImage"),
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListingData = req.body;
    console.log(req.files);
    let listing = await Listing.findByIdAndUpdate(id, newListingData);
    if (req.files && req.files.length > 0) {
      listing.image = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
      await listing.save();
    }
    req.flash("success", "Changes applied!");
    res.redirect(`/listing/${id}`);
  }),
);

// Create route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs", { file: "form" });
});

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  wrapAsync(async (req, res) => {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${req.body.pincode}, India`,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "RentPe/1.0",
        },
      },
    );
    const data = response.data;
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pincode not found",
      });
    }
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    let geometry = {
      type: "Point",
      coordinates: [lng, lat],
    };

    let newListing = req.body;
    newListing.owner = res.locals.currUser._id;
    newListing.image = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    newListing.geometry = geometry;
    await Listing.create(newListing);
    req.flash("success", "Listing created successful!");
    res.redirect("/listing");
  }),
);

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new expressError(400, "Invalid Listing Id"));
    }
    let list = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "written" } })
      .populate("owner");
    if (!list) {
      return next(new expressError(404, "Listing not found"));
    }

    res.render("listing/show.ejs", { list, file: "show", rating: "rating" });
  }),
);

// Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find().populate("reviews");
    res.render("listing/index.ejs", { listings, file: "index" });
  }),
);

module.exports = router;
