var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')

// routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// loader for mongoose
const mongoose = require('mongoose');

// bring in the dishes model
const Dishes = require('./models/dishes');

// server uri
const uri = 'mongodb://localhost:27017/conFusion';

// connects aaapp to db
const connect = mongoose.connect(uri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var app = express();

// invoke mthd connect
connect.then(db => {
  console.log('connected correctly to server....');
}, err => {
  console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('12345-67890-09876-54321'));

// everything after this has to be authorized
// authenticating fn
const auth = (req, res, next) => {
  console.log(req.signedCookies);


  if (!req.signedCookies.user) {   //if not authorized yet

    var authHeader = req.headers.authorization;

    if (!authHeader) {
      err = new Error('You are unauthorized, please log in');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);//skips middleware all the  way to error handler
      return;
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    var user = auth[0];
    var pass = auth[1];

    if (user == 'admin' && pass == 'password') {
      res.cookie('user', 'admin', { signed: true })
      next(); //authorized
    }
    else {
      var err = new Error('Not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }

  } else {

    if (req.signedCookies.user == 'admin') {
      next(); //authenticate
    } else {
      var err = new Error('You are not authenticated!')
      err.status = 401;
      next(err);
    }
  }

}
app.use(auth);


app.use(express.static(path.join(__dirname, 'public'))); //static server

//Mounting routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
