var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require("../search-helper");

router.get('/', function(req, res, next) {

    if (req.session.user) {
        search.getAllIdsTitles(req,function (allProductions) {
            search.getAllGenres(req, function (genres) {
                db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                    var productionData = rows;
                    var seasonSelection = req.query.seasonSelection ? req.query.seasonSelection : 1;
                    db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM episodes WHERE production = "${req.query.production}" AND seasonNumber = "${seasonSelection}";`, function (err, rows, fields) {
                        if (err) throw err;
                        res.render('production', {
                            title: 'Whitefox Streaming Video',
                            user: req.session.user,
                            productionData: productionData[0],
                            selectedSeason: seasonSelection,
                            episodeCount: rows.length,
                            episodeData: rows,
                            production_list: allProductions,
                            genre_list: genres
                        });
                    });
                });
            });
        });
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;
