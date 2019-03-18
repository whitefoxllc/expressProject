var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        //render user landing page
        res.render('userlandingpage', { title: 'Whitefox Streaming Video', message: `Welcome, ${req.session.user}!`, user: req.session.user });
    }
    else {
        res.render('login', { title: 'Whitefox Streaming Video', message: "Welcome to Whitefox Streaming Video" });
    }
});

module.exports = router;