const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require('../models/message')

exports.message_board_get = asyncHandler(async(req, res, next) => {
  const messages = await Message.find().populate("postedBy").sort({ dateTime: -1 }).limit(50);
  res.render('messageBoard', {title: "Message board", currentUser: req.session.currentUser, messages: messages});
});

exports.new_message_Post = [
    body("title")
    .trim()
    .isLength({ min: 2 })
    .withMessage('title must be least 2 characters')
    .escape(),
  body("message")
    .trim()
    .isLength({ min: 5 })
    .withMessage('message must be at least 5 characters')
    .escape(),

    // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newMessage = Message({
      title: req.body.title,
      message: req.body.message,
      dateTime: Date.now(),
      postedBy: req.session.currentUser._id,
    });

    if (!errors.isEmpty()) {
      console.log('there are errors');
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('newPostForm', {
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
        try {
        const result = await newMessage.save();
        res.redirect("/board");
        } catch(err) {
        return next(err);
        };
    }
  }),
];