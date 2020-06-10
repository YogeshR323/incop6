const mongoose = require('mongoose')
const createError = require('http-errors')
const Location = require('../models/location')
// const rate = require('../models/rate')
const rateTable = require('../models/rate')
const commentTable = require('../models/comment')
const db = require('../dbconnect')

// var user
// var onelocation
// var totalRated
// var heartclass
// const { sumOfLikes } = require('./queries')

exports.locationsGet = (req, res, next) => {
  return Location.find({ isApproved: true }).then((locations) => {
    // console.log(locations)
    res.render('locations', {
      user: req.user,
      locations,
    })
  })
}

exports.addlocationGet = (req, res, next) => {
  res.render('addlocation', { user: req.user })
}

exports.locationGet = async (req, res, next) => {
  let { id } = req.params
  let message = ''
  let heartclass = 0
  let totalRated = await rateTable
    .find({ location_id: mongoose.Types.ObjectId(id), rate: 1 })
    .countDocuments()
    .exec()
    .then(function (docs) {
      return docs
    })
    .catch(function (err) {
      throw err
    })

  if (req.user) {
    let didIRate = await rateTable.find(
      {
        // find if user has already rated
        location_id: mongoose.Types.ObjectId(id),
        user_id: mongoose.Types.ObjectId(req.user._id),
      },
      {
        // return only the rate field
        rate: 1,
        _id: 0, // explicitly exclude id field
      }
    )

    if (didIRate.length > 0 && didIRate[0].rate > 0) heartclass = didIRate.length
  }

  return Location.findOne({ _id: id }).then((onelocation) => {
    res.render('location', {
      user: req.user,
      onelocation,
      totalRated,
      heartclass,
    })
  })
}

exports.locationRatePost = async (req, res, next) => {
  console.log(req.user._id)
  console.log(req.body.locationID)
  res.redirect('/')
}

exports.adminPanelGet = (req, res, next) => {
  return Location.find({ isApproved: false }).then((locations) => {
    console.log(locations.length)
    res.render('adminPanel', {
      user: req.user,
      locations,
      length: locations.length,
    })
  })
}
exports.approveLocation = async (req, res, next) => {
  let { id } = req.params
  await Location.findByIdAndUpdate(id, { isApproved: true }, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      console.log(result)
    }
  })
  res.redirect('/adminPanel')
}

exports.ratingPost = async (req, res, next) => {
  try {
    const { userId, locationId, heartstate } = req.body
    console.log(userId)

    if (userId != null) {
      let ratestate = 0
      if (heartstate === 'heart') ratestate = 1

      await rateTable.findOneAndUpdate(
        {
          location_id: mongoose.Types.ObjectId(locationId),
          user_id: mongoose.Types.ObjectId(userId),
        },
        {
          $set: { rate: ratestate },
        },
        {
          // if document does not exist, then create it
          upsert: true,
        }
      )
      window.location.reload()
    } else {
      window.location.reload()
    }
  } catch (error) {
    res.render('login', { error })
  }
}

exports.commentPost = async (req, res, next) => {
  // console.log(req.body.comment)
  // console.log(req.body.locationID)
  // console.log(req.body.userID)

  try {
    const { user, locationId, comment } = req.body
    console.log(comment)
    console.log(locationId)
    console.log(user)
    console.log(typeof user)
    let userObj = user
      .replace('{\r\n', '')
      .replace('\r\n}', '')
      .replace(/'/g, '')
      .split(',')
      .map((x) => x.split(':').map((y) => y.trim()))
      .reduce((a, x) => {
        a[x[0]] = x[1]
        return a
      }, {})

    // alert(userObj.firstname)
    console.log(typeof userObj)

    console.log(userObj)
    console.log(userObj.username)
    console.log(userObj.firstname)
    console.log(userObj.lastname)

    if (user != null) {
      await commentTable.create({
        location_id: mongoose.Types.ObjectId(locationId),
        user_id: mongoose.Types.ObjectId(user._id),
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        comment,
      })
      res.redirect('back')
      // window.location.reload()
    } else {
      // window.location.reload()
    }
  } catch (error) {
    res.render('login', { error })
  }

  // console.log(userId)
  // console.log(locationId)
  // res.redirect('back');
}
