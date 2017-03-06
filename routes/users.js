/**
* @Author: mdrhri-6
* @Date:   2017-03-05T15:18:53+01:00
* @Last modified by:   mdrhri-6
* @Last modified time: 2017-03-06T10:44:37+01:00
*/

var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var multer = require('multer');
var upload = multer({dest: './uploads'});

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'Log In'
  });
});

router.post('/register', upload.single('profileimage'), function(req, res, next){
  // Get form data
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Check image field
  if (req.file) {
    console.log('Uploading File: ' + req.files.profileimage.name);

    // File info
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName         = req.files.profileimage.name;
    var profileImageMime         = req.files.profileimage.mimetype;
    var profileImagePath         = req.files.profileimage.path;
    var profileImageExt          = req.files.profileimage.extension;
    var profileImageSize         = req.files.profileimage.size;

  } else {
    var profileImageName = 'noimage.png';
  }

  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty().isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    // Set data to User model
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2,
      profileiamge: profileImageName
    });

    // Create new User
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and may log in using your credential');

    // res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new localStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if (!user) {
        console.log('Unknown User');
        return done(null, false, {message: 'Unknown user'});
      }
      User.comparePassword(password, user.password, function(err, isMacthed){
        if (err) throw err;
        if (isMacthed) {
          return done(null, user);
        } else {
          console.log('Invalid password');
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login',failureFlash: 'Invalid username or password'}), function(req, res){
  console.log('Authentication successfull');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have successfully logged out');
  res.redirect('/users/login');
});

module.exports = router;
