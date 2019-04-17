var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");
var account = require("../updateUser-helper");
router.get('/', function(req, res, next) {
    search.getAllIdsTitles(req,function (find) {
        search.getAllGenres(req, function (findGenre) {

            const accountQuery = `SELECT *  FROM users WHERE username = "${req.session.user}"`;
            db.readOnlyConnection.query(accountQuery,(err,rows, fields) => {

                res.render('account',{user: req.session.user,
                    email: rows[0].emailaddress,
                    name: rows[0].displayName,
                    dateCreated: rows[0].dateCreated,
                    status: "1",
                    password: rows[0].plainTextPasswordLol,
                    production_list: find,
                    genre_list: findGenre

                } )
            });

        });
    });
});
router.post('/', function(req, res) {
    db.writeUsersConnection.query(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`, function (err, rows, fields) {
        console.log(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`);
        console.log("new name " + req.body.displayName + " name: " + req.session.user)
        res.redirect('/account');
    });

});

module.exports = router;
