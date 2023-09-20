var express = require('express');
var router = express.Router();
const message_controller = require('../controllers/messageContoller');
const Message = require('../models/message');

router.get('/', message_controller.message_board_get);

router.get('/newPost', function(req, res, next) {
  console.log(req.session.currentUser);
  res.render('newPostForm', {title: "Create a new post", user: req.session.currentUser});
});

router.post('/newPost', message_controller.new_message_Post);

module.exports = router;