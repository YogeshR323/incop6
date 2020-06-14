let User = require('../models/user')


User.aggregate([
  {
    $addFields: {
      isAdmin: 0,
    },
  },
])
