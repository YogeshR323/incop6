let User = require('../models/user')

// try {
//   User.update({}, { $set: { isAdmin: false } }, { upsert: false, multi: true })
// } catch (err) {
//   console.log(err)
// }
User.aggregate([
  {
    $addFields: {
      isAdmin: 0,
    },
  },
])
