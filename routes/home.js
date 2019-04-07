var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");

router.get('/', function(req, res, next) {
    search.getIdTitle(req,function (sBar) {
        if (req.session.user) {
            sub.syncSessionWithDb(req, function () {
                //at present, the home page displays all productions.  In future, feature-specific functionality will determine displayProductions
                db.readOnlyConnection.query(`SELECT id, title FROM productions;`, function (err, rows, fields) {

                    console.log(req.session);
                    res.render('home', {
                        title: 'Whitefox Streaming Video',
                        message: `Welcome, ${req.session.user}!`,
                        user: req.session.user,
                        displayProductions: rows,
                        genre: req.query.genreSelection,
                        production_list: sBar
                    });
                });
            });
        } else {
            res.redirect("/");
        }
    }
});

module.exports = router;
