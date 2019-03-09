var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  //host: "ec2-3-83-84-122.compute-1.amazonaws.com",
  user: 'whiteFoxReadOnly',
  password: 'wfro5463!',
  database: 'whitefoxdb'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected...');
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Whitefox Streaming Video' });
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Whitefox Streaming Video' });
});


//todo For some reason, only the routes defined in this file get used.  Figure out why and fix.

var login = require("../login-helper.js");

/* GET login attempt. */
router.get('/login', function(req, res, next) {
    console.log(`attempted login with username=${req.query.username} and hash=${req.query.passwordHash}`);
    login.passwordIsValid(req.query.username, req.query.passwordHash,function (valid) {
        if (valid) {
            console.log("Login Successful");
            res.render('login', { title: 'success' });
        }
        else {
            console.log("Login Unsuccessful");
            res.render('login', { title: 'fail' });
        }
    });
});

module.exports = router;