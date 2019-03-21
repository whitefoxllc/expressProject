var express = require('express');
var router = express.Router();

var db = require("../db-helper.js");
var resHelper = require("../registration-helper");


/* GET registration page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Whitefox Streaming Video', message: "Please enter your registration details:" });
});

/* POST registration attempt. */
router.post('/', function(req, res, next) {
    resHelper.userExistsCheck(req.body.username, function (exists) {
        if (!exists) {
            resHelper.createUser(req.body, function () {
                req.session.user = req.body.username;
                res.redirect("/")
            });
        }
        else {
            res.render('register', { title: 'Whitefox Streaming Video', message: "Sorry, that user already exists." });
        }
    })
});

module.exports = router;