const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');


const User = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

User.plugin(passportLocalMongoose); //registers a plugin for this schema

module.exports = mongoose.model('User', User);