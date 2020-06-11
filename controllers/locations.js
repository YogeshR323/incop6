const mongoose = require('mongoose')
let fs = require('fs')
const Location = require('../models/location')
const rateTable = require('../models/rate')
const commentTable = require('../models/comment')
const { db } = require('../dbconnect')

// eslint-disable-next-line camelcase
const commentsGet = async (location_id) => {
  let comments = commentTable.find(
    { location_id: mongoose.Types.ObjectId(location_id) },
    {},
    { sort: { updatedAt: 'desc' } }
  )
  console.log(comments)
  return comments
}

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

exports.addLocationPost = (req, res, next) => {
  let img = fs.readFileSync(req.file.path)
  let encodeImage = img.toString('base64')

  let img2 = Buffer.from(encodeImage, 'base64')
  let trimStr = (str) => String(str).trim()

  let locationNew = new Location({
    title: trimStr(req.body.title),
    description: trimStr(req.body.description),
    contentType: req.file.mimetype,
    image: { filename: req.file.filename, data: img2, contentType: req.file.mimetype },
    uploadedby: trimStr(req.user.email),
    isApproved: false,
  })

  db.collection('locations').insertOne(locationNew, (err, result) => {
    console.log(result)

    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
}

/** ****************************************** */
/** *******For single location page*********** */
/** ****************************************** */

exports.locationGet = async (req, res, next) => {
  let { id } = req.params
  let heartclass = 0
  const comments = await commentsGet(id)
  let totalRated = await rateTable
    .find({ location_id: mongoose.Types.ObjectId(id), rate: 1 })
    .countDocuments()
    .exec()
    .then((docs) => {
      return docs
    })
    .catch((err) => {
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
      comments,
    })
  })
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
  try {
    const { user, locationId, comment } = req.body
    // user is returned as a string. Need to convert back to object
    let userObj = user
      .replace('{\r\n', '')
      .replace('\r\n}', '')
      .replace(/'/g, '')
      .split(',')
      .map((x) => x.split(':').map((y) => y.trim()))
      .reduce((a, x) => {
        // eslint-disable-next-line prefer-destructuring
        a[x[0]] = x[1]
        return a
      }, {})

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

/** ****************************************** */
/** ***********For admin users**************** */
/** ****************************************** */

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
  await Location.findByIdAndUpdate(id, { isApproved: true }, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      console.log(result)
    }
  })
  res.redirect('/adminPanel')
}
