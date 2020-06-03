let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  email: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },

});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);