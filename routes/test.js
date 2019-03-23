var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var prods = require("../production-helper");

//page for testing raw functionality

router.get('/', function(req, res, next) {

    if (req.session.user) {
        sub.syncSessionWithDb(req, function() {
            console.log(req.session);
            res.render('test', { title: 'Whitefox Streaming Video', message: `Welcome, ${req.session.user}!`, user: req.session.user});
        });

    }
    else {
        res.redirect("/");
    }
});



module.exports = router;
