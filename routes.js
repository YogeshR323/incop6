const passport = require('passport')
const router = require('express').Router()
// const createError = require('http-errors')
const multer = require('multer')

let fs = require('fs')
const { db } = require('./dbconnect')
// const User = require('./models/user')
const Location = require('./models/location')
const locationC = require('./controllers/locations')
const userC = require('./controllers/user')

// upload file path
const FILE_PATH = 'public/uploads'

// configure multer
const upload = multer({
  dest: `${FILE_PATH}/`,
  preservePath: true,
  fileFilter: (req, file, cb) => {
    // allow images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only images are allowed.'), false)
    }
    cb(null, true)
  },
})

router.get('/', locationC.locationsGet)

router.get('/signup', userC.signupGet)
router.post('/signup', userC.signupPost)

router.get('/login', (req, res) => {
  res.render('login', { user: req.user, message: req.flash('error') })
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect('/')
  }
)

router.get('/logout', userC.logoutGet)

// router.get('/addLocation', function (req, res) {
//   res.render('addlocation', { user: req.user })
// })

router.get('/addLocation', locationC.addlocationGet)

router.post('/addLocation', upload.single('locationimage'), (req, res) => {
  let img = fs.readFileSync(req.file.path)
  let encodeImage = img.toString('base64')

  let img2 = new Buffer(encodeImage, 'base64')
  // console.log(`Image: ${img2}`)

  let locationNew = new Location({
    title: req.body.title,
    description: req.body.description,
    contentType: req.file.mimetype,
    image: { filename: req.file.filename, data: img2, contentType: req.file.mimetype },
    uploadedby: req.user.email,
    isApproved: false,
  })

  db.collection('locations').insertOne(locationNew, (err, result) => {
    console.log(result)

    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

// router.get('/locations', locationC.locationsGet)

router.get('/location/:id', locationC.locationGet)
router.post('/location', locationC.locationRatePost) // temporary: to test passing of variables/objects
router.post('/rating', locationC.ratingPost)
router.post('/comments', locationC.commentPost)
router.get('/adminPanel', locationC.adminPanelGet)

router.get('/user/:id', userC.userProfileGet)
router.post('/user/', userC.updatePost)

router.get('/approve/:id', locationC.approveLocation)

module.exports = router
