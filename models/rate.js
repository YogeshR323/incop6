let mongoose = require('mongoose')

let { Schema } = mongoose

const Rate = new Schema({
  location_id: { type: Schema.Types.ObjectId, ref: 'location' },
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  rate: Number,
})

module.exports = mongoose.model('Rate', Rate, 'rateTable')
