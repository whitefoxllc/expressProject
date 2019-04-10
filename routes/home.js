var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");

router.get('/', function(req, res, next) {
    search.getIdTitle(req,function (find) {
        search.getGenre(req, function (findGenre) {


            if (req.session.user) {
                sub.syncSessionWithDb(req, function () {

                    //filters the displayed production list according to (in order of precedence) watchlist or selected genre
                    var productionFilter;
                    if (req.query.filterToSubscriptions) {
                        productionFilter = `WHERE id IN (SELECT production FROM slots WHERE subscriber = "${req.session.user}")`;
                    } else if (req.query.genre) {
                        productionFilter = `join genreTags on productions.id = genreTags.production WHERE genreTags.genre = "${req.query.genre}"`;
                    }

                    console.log(`filtering by genre ${productionFilter}`);
                    console.log(`SELECT id, title FROM productions ${productionFilter};`);
                    db.readOnlyConnection.query(`SELECT id, title FROM productions ${productionFilter};`, function (err, rows, fields) {
                        console.log(req.session);
                        console.log(rows);

                        res.render('home', {
                            title: 'Whitefox Streaming Video',
                            message: `Welcome, ${req.session.user}!`,
                            user: req.session.user,
                            displayProductions: rows,
                            production_list: find,
                            genre_list: findGenre
                        });
                    });
                });
            } else {
                res.redirect("/");
            }
        });
    });
});

module.exports = router;
