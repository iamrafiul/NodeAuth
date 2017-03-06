/**
* @Author: mdrhri-6
* @Date:   2017-03-05T15:18:53+01:00
* @Last modified by:   mdrhri-6
* @Last modified time: 2017-03-06T10:43:07+01:00
*/



var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
