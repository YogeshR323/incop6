let mongoose = require('mongoose')

// Connect mongoose
mongoose.connect(
  'mongodb://localhost/project6',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(
        'Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!'
      )
    } else {
      console.log('db connected!')
    }
  }
)
mongoose.set('useCreateIndex', true)
let db = mongoose.connection

module.exports = { db }
