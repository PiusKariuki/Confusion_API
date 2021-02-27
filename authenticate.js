var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var jwtStrategy = require('passport-jwt').Strategy;//jwt auth strategy plugin
var ExtractJwt = require('passport-jwt').ExtractJwt; //used to  create verify and sign tokens
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
// the metjods below serialize users to a session on login and deserialize on subsequent requests
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




exports.getToken = user => { //user = json obj. mthd creates token and gets it 
  return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

var opts = {}; //options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extractor. specifies how jwt is extracted from req
opts.secretOrKey = config.secretKey;

// constructing jwt auth strategy
exports.jwtPassport = passport.use(new jwtStrategy(opts,(jwt_payload, done) => { //verify func
  console.log(`JWT payload: ${jwt_payload}`);
  //there's an id field in the jwt payload ie payload.sub
  User.findOne({_id: jwt_payload._id}, (err, user) =>{ 
    if(err){
      return done(err,false); //done(err,user,info) is a callback passed by passport into our auth strategy
    }
    else if(user){
      return done(null,user);
    }
    else{
      return done(null, false);
    }
  });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false}); 