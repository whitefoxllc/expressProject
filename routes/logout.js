var express = require('express');
var router = express.Router();


/* GET logout*/
router.get('/', function(req, res, next) {
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/');
});

module.exports = router;