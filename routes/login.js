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

var login = require("../login-helper.js");

/* GET login attempt. */
router.get('/', function(req, res, next) {
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