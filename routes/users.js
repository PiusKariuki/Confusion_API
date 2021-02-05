var express = require('express');
var router = express.Router();
var User = require('../models/users');
const bodyParser = require('body-parser');


// body parser middleware
router.use(bodyParser.json());

// signup endpoint
router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user != null) {
        var err = new Error(`User ${user.username} already exists`);
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }

    })
    .then(user => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration successful!!', user: user })
    }, err => next(err))
    .catch(err => next(err))
});

// login endpoint
router.post('/login', (req, res, next) => {
  // check for sessions
  // no session
  if (!req.session.user) {

    var authHeader = req.headers.authorization;
    // verifying presence of authorization headers
    if (!authHeader) {
      var err = new Error('You\'re not authorized');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(" ")[1], 'base64').toString().split(":")
    var username = auth[0];
    var password = auth[1];

    // find one User whose username is username
    User.findOne({ username: username })
      .then(user => {
        if (user === null) {
          var err = new Error(`User: ${username} does not exist!!`);
          err.status = 401;
          return next(err);
        } else if (user.password !== password) {
          var err = new Error('Incorrect password!!');
          err.status = 401;
          return next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('content-Type', 'text/plain');
          res.end('Your\'re  authenticated');
        }
      })
      .catch(err => next(err))
  }

  // else theres a session
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('you\'re already authenticated!');
  }

});

// logout endpoint
router.get('/logout', (req,res) =>{
  // if there's  a session
  if(req.session){
    req.session.destroy();  //removes session info from server
    res.clearCookie('session-id'); //invokes client to clear cookies
    res.redirect('/');
  }

  else{
    err = new Error('You aren\'t logged in');
    err.status = 403;
    next(err);
  }

})

module.exports = router;
