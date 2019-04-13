var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");

router.get('/', function(req, res, next) {

    res.render("user", {title: 'userProfile'});
});

module.exports = router;
