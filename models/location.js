let mongoose = require('mongoose')

let { Schema } = mongoose

const Location = new Schema({
  image: { filename: String, data: Buffer, contentType: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  contentType: { type: String, required: true },
})

module.exports = mongoose.model('Location', Location)
