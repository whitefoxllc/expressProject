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
            const addressQuery = `SELECT * FROM userBillingAddress WHERE user = "${req.session.user}"`;
            db.readOnlyConnection.query(accountQuery,addressQuery,(err,rows, fields) => {

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
    if (typeof req.body.displayName !== 'undefined') {
        db.writeUsersConnection.query(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`, function (err, rows, fields) {
            console.log(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`);
            console.log("new name " + req.body.displayName + " name: " + req.session.user)
            res.redirect('/account');
        });
    }
    else if (typeof req.body.password !== 'undefined') {
        db.writeUsersConnection.query(`UPDATE users SET plainTextPasswordLol = "${req.body.password}" Where username = "${req.session.user}";`,function (err,rows,fields) {
            res.redirect('/account');
        });

    }
    else if (typeof req.body.email !== 'undefined')
    {
        db.writeUsersConnection.query(`UPDATE users SET emailaddress = "${req.body.email}" Where username = "${req.session.user}";`,function (err,rows,fields) {
            res.redirect('/account');
        });
    }
    else if (typeof req.body.str1 !== 'undefined')
    {
        db.writeUsersConnection.query(`Select * FROM userBillingAddress WHERE "${req.session.user}";`,function (err,rows,flieds) {
            if (!rows.user )
            {
                db.writeUsersConnection.query(`INSERT INTO userBillingAddress (user, streetLine1,streetLine2,state,zipCode,country)
                                                VALUES ("${req.session.user}", "${req.body.str1}","${req.body.str2}","${req.body.state}","${req.body.zip}","${req.body.country}";`,
                    function (err,rows,fields) {
                    res.redirect('/account');
                });
            }
            else {
                db.writeUsersConnection.query(`UPDATE userbillingAddress SET streetLine1 = "${req.body.srt1}", streetLine2  `)
            }

        });
    }
    else
    {
        res.redirect('/account');
    }

});

module.exports = router;
