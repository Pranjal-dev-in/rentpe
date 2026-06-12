const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

// SignUp Route
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs", { file: "form" });
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { email, password } = req.body;
      let name = req.body.fname + " " + req.body.lname;
      let newUser = new User({
        email: email,
        name: name,
      });
      await User.register(newUser, password);
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("info", "User signup successful!");
        res.redirect("/listing");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

//Login Route
router.get("/login", (req, res) => {
  res.render("user/login.ejs", { file: "form" });
});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    try {
      req.flash("info", "Login successful!");
      let redirect = res.locals.redirectUrl || "/listing";
      res.redirect(redirect);
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/login");
    }
  }),
);

//Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("info", "User logged out!");
    res.redirect("/listing");
  });
});
module.exports = router;
