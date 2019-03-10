var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Whitefox Streaming Video' });
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Whitefox Streaming Video' });
});

module.exports = router;