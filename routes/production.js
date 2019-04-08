var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require("../search-helper");
var def = 1;

    router.get('/', function(req, res, next) {
        search.getIdTitle(req,function (find) {
            if (req.session.user) {
                //fetch data production data from db
                db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                    var productionData = rows;

                    //if a season has been selected, fetch episodes' data, else render the page without it
                    if (req.query.seasonSelection) {
                        console.log("season selected ready to roll");
                        db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM episodes WHERE production = "${req.query.production}" AND seasonNumber = "${req.query.seasonSelection}";`, function (err, rows, fields) {

                            res.render('production', {
                                title: 'Whitefox Streaming Video',
                                user: req.session.user,
                                productionData: productionData[0],
                                season: req.query.seasonSelection,
                                episodeCount: rows.length,
                                episodeData: rows,
                                production_list: find
                            });
                        });
                    } else {
                        console.log("No season selected yet defaulting to 1!!!");
                        var i = 1;
                        db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM episodes WHERE production = "${req.query.production}" AND seasonNumber = "${i}";`, function (err, rows, fields) {
                            res.render('production', {
                                title: 'Whitefox Streaming Video',
                                user: req.session.user,
                                productionData: productionData[0],
                                season: req.query.seasonSelection,
                                episodeCount: rows.length,
                                episodeData: rows,
                                production_list: find
                            });
                        });
                    }
                });
            } else {
                res.redirect("/");
            }
        });
});

module.exports = router;
