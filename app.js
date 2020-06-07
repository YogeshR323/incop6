const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const multer = require('multer')

const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.multipart({extended: false}));
app.use(cookieParser())
app.use(session({ keys: ['secretkey1', 'secretkey2', '...'] }))
app.use(flash())

app.use(express.static(path.join(__dirname, 'public')))

// Configure passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Configure passport-local to use user model for authentication
const User = require('./models/user')

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// mongoose.connection
//   .once('once', function () {
//     console.log('Connection has been made')
//   })
//   .on('error', function (error) {
//     console.log('connection error:', error)
//   })

// Register routes
app.use('/', require('./routes'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {},
  })
})

module.exports = app
