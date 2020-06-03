const passport = require('passport');
const User = require('./models/user');
const Location = require('./models/location');
const router = require('express').Router();
const createError = require('http-errors');
const multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');

mongoose.connect('mongodb://localhost/project6');

var conn = mongoose.connection;

// upload file path
const FILE_PATH = 'uploads';

// configure multer
const upload = multer({
    dest: `${FILE_PATH}/`, 
    preservePath: true,
    fileFilter: (req, file, cb) => {
        // allow images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only images are allowed.'), false);
        }
        cb(null, true);
    }
});


router.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  let trimStr = (str) => String(str).trim()
  let email= req.body.username
  let firstname= req.body.firstname
  let lastname= req.body.lastname
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  console.log(req.body)

  if (!firstname || !lastname || !password || !email)
    throw createError(400, 'all Fields are required')
  firstname = trimStr(firstname)
  lastname = trimStr(lastname)
  email = trimStr(email)
  if (password !== confirmPassword) throw createError(400, 'Passwords do not match.')

  User.register(new User({
    username: req.body.username, 
    email: req.body.username, 
    firstname: req.body.firstname,  
    lastname: req.body.lastname}), req.body.password, function(err) {
      console.log(req.body) 
      if (err) {
        console.log('error while user register!', err);
        return next(err);
      }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.firstname);
        console.log('user registered!');
        res.redirect('/');
      });    
    }
  );
});

router.get('/login', function(req, res) {
  res.render('login', {user: req.user, message: req.flash('error')});
});

router.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login', 
  failureFlash: true }), function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/addLocation', function(req, res) {
  res.render('addlocation', {user: req.user})
})

// router.post('/addLocation', function(req, res, next) {
//   console.log('adding location');
//   // let locationimage = fs.readFileSync(req.body.locationimage)
//   // let title = req.body.title
//   // let description = req.body.description
//   console.log(req.body) 
  
  

//   // if (!locationimage || !title || !description )
//   //   throw createError(400, 'all Fields are required')
  
//     var locationnew = new Location;
//     locationnew.locationimage.data = fs.readFileSync(req.body.locationimage);
//     locationnew.locationimage.contentType = 'image/jpg';
//     locationnew.save(function (err, a) {
//       if (err) throw err;

//       console.error('saved img to mongo');
//     })


//   // Location.save(new Location({
//   //   locationimage: req.body.locationimage,
//   //   title: req.body.title,
//   //   description: req.body.description,}), function(err) {
//   //     console.log(req.body) 
//   //     if (err) {
//   //       console.log('error while location register!', err);
//   //       return next(err);
//   //     }
//   //   })

//   // var locationnew = {
//   //   locationimage.data: fs.readFileSync(req.body.locationimage),
//   //   locationimage.contentType = 'image/jpg';
//   //   title: req.body.title,
//   //   description: req.body.description,}
//   //   conn.collection('locations').insertOne(locationnew);

// res.redirect('/')

// })


// router.post('/addLocation', upload.single('locationimage'), async (req, res) => {
// //https://attacomsian.com/blog/express-file-upload-multer
//     try {
//       console.log(req.body) 
//         const locationimage = req.file;

//         // make sure file is available
//         if (!locationimage) {
//             res.status(400).send({
//                 status: false,
//                 data: 'No file is selected.'
//             });
//         } else {
//             // send response
//             res.send({
//                 status: true,
//                 message: 'File is uploaded.',
//                 data: {
//                     name: locationimage.originalname,
//                     mimetype: locationimage.mimetype,
//                     size: locationimage.size,
//                     encoding: locationimage.encoding, 
//                     destination: locationimage.destination, 
//                     filename: locationimage.filename,
//                     path: locationimage.path
//                 }
//             });
//         }

//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.post('/addLocation', upload.single('locationimage'), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database

  var locationNew = {
    title: req.body.title,
    description: req.body.description,
    contentType: req.file.mimetype,
    image:  new Buffer(encode_image, 'base64')
  };
  conn.collection('locations').insertOne(locationNew, (err, result) => {
    console.log(result)

    if (err) return console.log(err)
 
    console.log('saved to database')
    res.redirect('/')
   
     
  })
})

router.get('/locations', function(req, res) {
  res.render('locations', {user: req.user})
})


module.exports = router;