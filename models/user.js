/**
* @Author: mdrhri-6
* @Date:   2017-03-06T00:08:39+01:00
* @Last modified by:   mdrhri-6
* @Last modified time: 2017-03-06T01:35:06+01:00
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');
var bcrypt = require('bcrypt');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimage: {
    type: String
  }
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if (err) throw err;
    newUser.password = hash;
    newUser.save(callback);
  });
};

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
};

module.exports.comparePassword = function(password, hash, callback){
  bcrypt.compare(password, hash, function(err, isMathched){
    if (err) return callback(err);
    callback(null, isMathched);
  });
};
