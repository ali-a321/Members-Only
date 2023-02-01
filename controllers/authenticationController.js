const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "Sign Up" });
};

exports.signup_post = [
  body("firstname", "First name must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("lastname", "Last name must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("username", "Username must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("password", "Password must be greater than 6 characters.")
  .trim()
  .isLength({ min: 7 })
  .escape(),
  body("confirmpassword", "Password must be greater than 6 characters.")
  .trim()
  .isLength({ min: 7 })
  .escape()
  .custom(async (value, { req }) => {
    // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
    if (value !== req.body.password) throw new Error('Passwords must be the same');
    return true;
  }),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("ERROR!");
      return res.render("signup_form", { title: "Sign Up", passwordConfirmationError: "Passwords must be the same" });
    }
  try {
    const isUserInDB = await User.find({ "username": req.body.username });
    if (isUserInDB.length > 0) return res.render("signup_form", { title: "Sign Up", error: "User already exists" });
    // If username does not exist, continute to register new user to db
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        member: false,
        admin: false,
      }).save(err => err ? next(err) : res.redirect("/log-in"));
    });
  } catch (err) {
    return next(err);
  }
}
];

exports.login_get = (req, res) => {
  // If user is already logged in, redirect them to the homepage
  if (res.locals.currentUser) return res.redirect("/"); 
  res.render("login_form", { title: "Login" });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.logout_get = (req, res) => {
  req.logout();
  res.redirect("/");
}