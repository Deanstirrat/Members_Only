const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const passport = require('passport');

// Custom validation function to check if two password fields match
const passwordsMatch = (value, { req }) => {
  console.log("check passwords");
  if (value !== req.body.password) {
    throw new Error('Passwords do not match');
  }
  return true;
};


/* GET sign-up form. */
exports.signup_get = (req, res, next) => {
  res.render('signup', {
    title: 'Please sign-up' 
  });
}
/* POST sign-up form. */
exports.signup_post = [
  //Validate/sanitize
  body("firstName", "First Name:")
    .trim()
    .isLength({ min: 2 })
    .withMessage('first name: at least 2 letters')
    .isAlpha()
    .withMessage('first name: only letters allowed')
    .escape(),
  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage('last name: at least 2 letters')
    .isAlpha()
    .withMessage('first name: only letters allowed')
    .escape(),
  body("email", "Must be valid email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .escape(),
  body("password")
    .trim()
    .isStrongPassword({minSymbols: 0})
    .withMessage("Must be strong password")
    // .isInt({gt: 30})
    .escape(),
  body("passwordConfirm")
    .trim()
    .custom(passwordsMatch),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    console.log('create user');

    const newUser = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      member: false,
    });

    if (!errors.isEmpty()) {
      console.log('there are errors');
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('signup', {
        title: 'Please sign-up' ,
        user: newUser,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      const userExists = await User.findOne({ email: req.body.email }).exec();
      if (userExists) {
        res.render("signup", {
          title: "Email already in use",
          user: newUser,
        });
      }
      //Hash Pasword and add user to db
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err) return next(err);
        else{
          try {
            //add hashed password to user and upload
            newUser.password = hashedPassword;
            const result = await newUser.save();
            res.redirect("/");
          } catch(err) {
            return next(err);
          };
        }
      });
    }
  }),
];


/* GET sign-in form. */
exports.signin_get = (req, res, next) => {
  res.render('signin', {
    title: 'Please sign-in' 
  });
}
/* POST sign-in form. */
exports.signin_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/users/signin"
  })(req,res,next);
}

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.unlock_get = (req, res, next) => {
  res.render('unlock', {
    title: 'Unlock exclusive access:' 
  });
}
exports.unlock_post = [
  //Validate/sanitize
  body("passcode", "invalid passcode")
    .trim()
    .equals('123456')
    .escape(),

   // Process request after validation and sanitization.
   asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('unlock', {
        title: 'Unlock exclusive access:' ,
        errors: errors.array(),
      });
      return;
    } else {
      console.log('correct passcode');
      try{
        const result = await User.findOneAndUpdate({_id: req.session.currentUser._id}, {member: true});
        res.redirect('/board');
      }catch(err){
          return next(err);
      }
    }
   }),
];