var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require("../search-helper");

router.get('/', function(req, res, next) {
    search.getAllIdsTitles(req,function (find) {
        search.getAllGenres(req, function (findGenre) {
            if (req.session.user) {
                db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                    var productionData = rows;
                    var season = req.query.seasonSelection ? req.query.seasonSelection : 1;
                    db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM episodes WHERE production = "${req.query.production}" AND seasonNumber = "${season}";`, function (err, rows, fields) {
                        if (err) throw err;
                        res.render('production', {
                            title: 'Whitefox Streaming Video',
                            user: req.session.user,
                            productionData: productionData[0],
                            season: season,
                            episodeCount: rows.length,
                            episodeData: rows,
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
