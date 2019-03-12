var express = require('express');
var router = express.Router();

var login = require("../login-helper.js");

/* GET login attempt. */
router.post('/', function(req, res, next) {
    console.log(`attempted login with username=${req.body.username} and hash=${req.body.password}`);
    login.passwordIsValid(req.body.username, req.body.password,function (valid) {
        if (valid) {
            console.log("Login Successful");
            req.session.user = req.body.username;
            console.log(`set session.user=${req.session.user}`);
            res.render('userlandingpage', { title: 'success', user: req.session.user});
        }
        else {
            console.log("Login Unsuccessful");
            res.render('login', { title: 'fail' });
        }
    });
});


/* GET logout*/
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/');
});

module.exports = router;