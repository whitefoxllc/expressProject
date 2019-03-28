var express = require('express');
var router = express.Router();

var login = require("../login-helper.js");

/* GET login attempt. */

router.get('/', function(req, res, next) {
    if (req.session.user) {
        res.redirect("/home");
    }
    else {
        res.render("login", {title: 'Log in to Whitefox'});
    }
});

router.post('/', function(req, res, next) {

    if (req.session.user) {
        res.redirect("/home");
    }
    else {
        login.passwordIsValid(req.body.username, req.body.password, function (valid) {
            if (valid) {
                req.session.user = req.body.username;
                res.redirect("/home");
            }
            else {
                res.render("login", {title: 'Log in to Whitefox', message: "Credentials do not match an existing account. Please try again."});
            }
        });
    }
});
// this is GUS
/* GET logout*/
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(){
        res.redirect(req.originalUrl);
    });
});

module.exports = router
//module.exports = {username, etc};