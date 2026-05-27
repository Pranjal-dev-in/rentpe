require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const expressError = require("./utils/expressError.js");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const User = require("./models/user.js");
const passport = require("passport");
const passportLocal = require("passport-local");
const flash = require("connect-flash");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRouters = require("./routes/user.js");

main()
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_URL);
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in Mongo Session Store", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOption));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.locals.currUser = req.user;
  next();
});

passport.use(
  new passportLocal({ usernameField: "email" }, User.authenticate()),
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listing", listingRoutes);
app.use("/listing/:id/review", reviewRoutes);
app.use("/", userRouters);

app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Page not found Middleware
app.use((req, res, next) => {
  next(new expressError(404, "Page not found!"));
});

// Error handler Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  if (err.name === "ValidationError") {
    return res.status(400).send(message);
  }
  res
    .status(status)
    .render("listing/error.ejs", { status, message, file: "error" });
});

app.listen(3000, () => {
  console.log("Listening to Port 3000");
});
