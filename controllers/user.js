const passport = require('passport')
const createError = require('http-errors')
const User = require('../models/user')
const db = require('../dbconnect')

exports.signupGet = (req, res) => {
  res.render('signup', {})
}

exports.signupPost = (req, res, next) => {
  console.log('registering user')
  let trimStr = (str) => String(str).trim()
  let email = req.body.username
  let { firstname } = req.body
  let { lastname } = req.body
  let { password } = req.body
  let { confirmPassword } = req.body
  console.log(req.body)

  if (!firstname || !lastname || !password || !email)
    throw createError(400, 'all Fields are required')
  firstname = trimStr(firstname)
  lastname = trimStr(lastname)
  email = trimStr(email)
  if (password !== confirmPassword) throw createError(400, 'Passwords do not match.')

  User.register(
    new User({
      username: email,
      email,
      firstname,
      lastname,
    }),
    req.body.password,
    function (err) {
      console.log(req.body)
      if (err) {
        console.log('error while user signup!', err)
        return next(err)
      }
      passport.authenticate('local')(req, res, function () {
        req.flash('success', `Successfully Signed Up! Nice to meet you ${req.body.firstname}`)
        console.log('user registered!')
        res.redirect('/')
      })
    }
  )
}

exports.logoutGet = (req, res, next) => {
  try {
    req.logout()
    return res.redirect('/')
  } catch (error) {
    return next(error)
  }
}

exports.userGet = (req, res, next) => {
  try {
    res.render('user', { user: req.user })
  } catch (error) {
    console.log(error)
  }
}

exports.updatePost = (req, res, next) => {
  console.log('updating  user')
  let trimStr = (str) => String(str).trim()
  let email = req.body.username
  let { firstname } = req.body
  let { lastname } = req.body
  let { password } = req.body
  let { confirmPassword } = req.body
  let id = req.user._id
  console.log(req.body)

  if (!firstname || !lastname || !password || !email)
    throw createError(400, 'all Fields are required')
  firstname = trimStr(firstname)
  lastname = trimStr(lastname)
  email = trimStr(email)
  if (password !== confirmPassword) throw createError(400, 'Passwords do not match.')

  User.findByIdAndUpdate(
    req.user._id,
    {
      username: email,
      email,
      firstname,
      lastname,
      password,
    },
    function (err, uuu) {
      if (err) {
        throw err
      } else {
        console.log(uuu)
      }
    }
  )
  res.redirect('/')
}
