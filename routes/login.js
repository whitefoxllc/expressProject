var express = require('express');
var router = express.Router();

var login = require("../login-helper.js");

/* GET login attempt. */
router.post('/', function(req, res, next) {
    login.passwordIsValid(req.body.username, req.body.password, function (valid) {
        if (valid) {
            req.session.user = req.body.username;
            //res.render('userlandingpage', { title: 'success', user: req.session.user});
        }
        else {
            res.render('loginfailed', { title: 'Log in to Whitefox' });
        }
    });
});
// this is GUS
/* GET logout*/
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router
//module.exports = {username, etc};