var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.currentUser) res.redirect('/board')
  res.render('index', { title: 'Secret message board'});
});

module.exports = router;
