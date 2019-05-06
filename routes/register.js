var express = require('express');
var router = express.Router();

var resHelper = require("../registration-helper");
var validation = require("../validation-helper");

/* GET registration page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Whitefox Streaming Video', message: "Please enter your registration details:" });
});

/* POST registration attempt. */
router.post('/', function(req, res, next) {
    let errorMessage = null;
    let username = req.body.username;

    resHelper.userExistsCheck(username, function (exists) {
        if (!exists && validation.isValidUsername(username)) {
            resHelper.createUser(req.body, function () {
                req.session.user = username;
                res.redirect("/")
            });
        }
        else {
            if (exists) {
                errorMessage = "Sorry, that user already exists. Please select a different username.";
            }
            else {
                errorMessage = "Please enter a valid username (alphanumeric, '-' and '_' only)";
            }
            res.render('register', { title: 'Whitefox Streaming Video', message: errorMessage });
        }
    });





});

module.exports = router;