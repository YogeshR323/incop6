let mongoose = require('mongoose')

let { Schema } = mongoose
let passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
  email: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  isAdmin: Boolean,
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)
