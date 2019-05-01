var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");
var rev = require("../review-helper");
var revs = require("../comment-helper");

router.get('/', function(req, res, next) {
    search.getAllIdsTitles(req,function (find) {
        search.getAllGenres(req, function (findGenre) {

            if (req.session.user){
                sub.syncSessionWithDb(req, function(){
                    revs.reviewRead(req, req.session.user, function(reviewstuff){
                    var productionFilter;
                    if (req.query.filterToSubscriptions) {
                        productionFilter = `WHERE id IN (SELECT production FROM slots WHERE subscriber = "${req.session.user}")`;
                    } else if (req.query.genre) {
                        productionFilter = `join genreTags on productions.id = genreTags.production WHERE genreTags.genre = "${req.query.genre}"`;
                    }

                    console.log(`filtering by genre ${productionFilter}`);
                    console.log(`SELECT id, title FROM productions ${productionFilter};`);
                    db.readOnlyConnection.query(`SELECT id, title FROM productions ${productionFilter};`, function (err, rows, fields) {
                        if (err) throw err;
                        console.log(req.session);
                        console.log(rows);

                        res.render('user', {
                            
                            title: req.session.user,
                            displayProductions: rows,
                            production_list: find,
                            genre_list: findGenre,
                            reviews:reviewstuff
                        });
                    });
                    });

                });
            }
            
            else {
                res.redirect("/");
            }
        });
    });
});

module.exports = router;
