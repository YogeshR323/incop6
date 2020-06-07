const Location = require('../models/location')
const db = require('../dbconnect')

exports.locationsGet = (req, res, next) => {
  return Location.find().then((locations) => {
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

exports.locationGet = (req, res, next) => {
  let { id } = req.params
  //   if (req.user) console.log(req.user)
  return Location.find({ _id: id }).then((onelocation) => {
    console.log('get one location:')
    console.log(onelocation)
    res.render('location', { user: req.user, onelocation })
  })
}
