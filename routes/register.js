var express = require('express');
var router = express.Router();

var db = require("../db-helper.js");
var resHelper = require("../registration-helper");


/* GET registration page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Whitefox Streaming Video', message: "Please enter your registration details:" });
});

/* GET registration attempt. */
router.post('/createUser', function(req, res, next) {
    console.log(`Form submitted with ${req.body.username}, ${req.body.email}, ${req.body.password}, `)
    resHelper.userExistsCheck(req.body.username, function (exists) {
        if (!exists) {
            console.log("user doesn't exist yet");
            resHelper.createUser(req.body, function () {
                req.session.username = req.body.username;
                res.render('userlandingpage', { user: req.session.username});
            });
        }
        else {
            console.log("user already exists");
            res.render('register', { title: 'Whitefox Streaming Video', message: "Sorry, that user already exists." });
        }
    })

        //create user
        //set session.user = username
    //else display error


});

module.exports = router;