var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require("../search-helper");
var subs = require("../subscription-helper");
var prods = require("../production-helper");

router.get('/', function(req, res, next) {

    if (req.session.user) {
        subs.syncSessionWithDb(req, function () {
            search.getAllIdsTitles(req,function (allProductions) {
                search.getAllGenres(req, function (genres) {
                    db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                        var productionData = rows;
                        var seasonSelection = req.query.seasonSelection ? req.query.seasonSelection : 1;
                        var episodeSelection = req.query.episodeSelection ? req.query.episodeSelection : null;
                        prods.getAllFileUrls(req, req.query.production, function(epData) {
                            res.render('production', {
                                title: 'Whitefox Streaming Video',
                                user: req.session.user,
                                productionData: productionData[0],
                                selectedSeason: seasonSelection,
                                selectedEpisode: episodeSelection,
                                episodeCount: epData ? (epData[seasonSelection].length - 1) : 0,
                                episodeData: epData,
                                production_list: allProductions,
                                genre_list: genres
                            });
                        });
                    });
                });
            });
        })
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;
