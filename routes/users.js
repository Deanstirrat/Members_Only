var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET sign-up form. */
router.get('/signup', user_controller.signup_get);
/* POST sign-up form. */
router.post("/signup", user_controller.signup_post);

/* GET sign-up form. */
router.get('/signin', user_controller.signin_get);
/* POST sign-up form. */
router.post("/signin", user_controller.signin_post);

/* GET log-out. */
router.get("/logout", user_controller.logout);

router.get('/unlock', user_controller.unlock_get);
router.post('/unlock', user_controller.unlock_post);

module.exports = router;
