const passport = require('passport')
const router = require('express').Router()
const multer = require('multer')

const { db } = require('./dbconnect')
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
  res.render('login', { user: req.user, error: req.flash('error') })
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.',
  }),
  (req, res) => {
    res.redirect('/')
  }
)

router.get('/logout', userC.logoutGet)

router.get('/addLocation', locationC.addlocationGet)

router.post('/addLocation', upload.single('locationimage'), locationC.addLocationPost)

router.get('/location/:id', locationC.locationGet)
router.post('/rating', locationC.ratingPost)
router.post('/comments', locationC.commentPost)
router.get('/adminPanel', locationC.adminPanelGet)

router.get('/user/:id', userC.userProfileGet)
router.post('/user/', userC.updatePost)

router.get('/approve/:id', locationC.approveLocation)

module.exports = router
