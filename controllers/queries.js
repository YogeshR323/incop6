const mongoose = require('mongoose')
// mongoose.Promise = require('bluebird')

const rate = require('../models/rate')

const sumOfLikes = async (id) => {
  // id is the location id.
  //   return rate.find({ location_id: id, rate: 1 }).countDocuments().exec()
  //   const totalrate = 0

  await rate
    .find({ location_id: mongoose.Types.ObjectId(id), rate: 1 })
    .countDocuments()
    .exec()
    .then((docs) => {
      console.log(`in queries ${docs}`)
      return docs
    })
    .catch((err) => {
      throw err
    })
}

module.exports = {
  sumOfLikes,
}
