let mongoose = require('mongoose')

let { Schema } = mongoose

const Comment = new Schema(
  {
    location_id: { type: Schema.Types.ObjectId, ref: 'location' },
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    firstname: String,
    lastname: String,
    comment: String,
    updatedAt: Date,
    createdAt: Date,
  },
  {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now()) },
  }
)

module.exports = mongoose.model('Comment', Comment, )
