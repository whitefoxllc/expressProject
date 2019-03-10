var express = require('express');
var router = express.Router();

var db = require("../db-helper.js");

/* GET register attempt. */
router.get('/createUser', function(req, res, next) {
    //put registration code here
    res.render('login', { title: 'user created (but not really)' });
});

module.exports = router;