const passport = require('passport')
const createError = require('http-errors')
const User = require('../models/user')

exports.signupGet = (req, res) => {
  res.render('signup', {})
}

exports.signupPost = async (req, res, next) => {
  console.log('registering user')
  let trimStr = (str) => String(str).trim()
  let email = req.body.username
  let { firstname } = req.body
  let { lastname } = req.body
  let { password } = req.body
  let { confirmPassword } = req.body

  if (!firstname || !lastname || !password || !email)
    return res.render('signup', { error: 'all Fields are required' })

  firstname = trimStr(firstname)
  lastname = trimStr(lastname)
  email = trimStr(email)
  if (password !== confirmPassword)
    return res.render('signup', { error: 'Passwords do not match.' })

  await User.register(
    new User({
      username: email,
      email,
      firstname,
      lastname,
      isAdmin: false,
    }),
    req.body.password,
    (err) => {
      if (err) {
        console.log('error while user signup!', err)
        return next(err)
      }
      passport.authenticate('local')(req, res, () => {
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

exports.userProfileGet = (req, res, next) => {
  try {
    res.render('user', { user: req.user })
  } catch (error) {
    console.log(error)
  }
}

exports.updatePost = async (req, res, next) => {
  console.log('updating  user')
  let trimStr = (str) => String(str).trim()
  let email = req.body.username
  let { firstname } = req.body
  let { lastname } = req.body
  let { password } = req.body
  let { confirmPassword } = req.body

  if (!firstname || !lastname || !password || !email)
    return next(createError(400, 'All Fields are required'))
  firstname = trimStr(firstname)
  lastname = trimStr(lastname)
  email = trimStr(email)
  if (password !== confirmPassword) return next(createError(400, 'Passwords do not match.'))

  await User.findByIdAndUpdate(
    req.user._id,
    {
      username: email,
      email,
      firstname,
      lastname,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json(err)
      }
      console.log(result)
    }
  )

  User.findByIdAndUpdate(req.user._id).then(
    (sanitizedUser) => {
      if (sanitizedUser) {
        sanitizedUser.setPassword(password, () => {
          sanitizedUser.save()
          res.status(200).json({ message: 'password reset successful' })
        })
      } else {
        res.status(500).json({ message: 'This user does not exist' })
      }
    },
    (err) => {
      console.error(err)
    }
  )

  res.redirect('/')
}
