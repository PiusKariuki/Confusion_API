var express = require('express');
var router = express.Router();
var User = require('../models/users');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const { rawListeners } = require('../models/users');


// body parser middleware
router.use(bodyParser.json());

// signup endpoint
router.post('/signup', (req, res, next) => {
  // register is  mongoose plugin mthd
  // rem we plugged in at the model
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    }

    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }

        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ Success: true, status: 'Registration successful!!' })
        });
      })
    }

  });
});

// login endpoint
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id }); //this will be the payload.ir the user id
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ Success: true, token: token, status: 'You are logged in!!' })
});

// logout endpoint
router.get('/logout', (req, res) => {
  // if there's  a session
  if (req.session) {
    req.session.destroy();  //removes session info from server
    res.clearCookie('session-id'); //invokes client to clear cookies
    res.redirect('/');
  }

  else {
    err = new Error('You aren\'t logged in');
    err.status = 403;
    next(err);
  }

})

module.exports = router;
