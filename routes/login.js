var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    //host: "ec2-3-83-84-122.compute-1.amazonaws.com",
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
});



/* POST login attempt. */
/*router.get('/login/:username/:hash', function(req, res, next) {
    console.log(`attempted login with username=${req.params.username} and hash=${req.params.hash}`);
    if (ifValidPassword(req.params.username, req.params.hash)) {
        console.log("Login Successful").
        res.render('userlandingpage', { user: 'username goes here' });
    }
    else {
        console.log("Login Unsuccessful").
        res.render("loginfailed");
    }
});*/

module.exports = router;