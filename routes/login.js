var express = require('express');
var router = express.Router();

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