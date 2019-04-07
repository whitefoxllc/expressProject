var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require('../search-helper');
router.get('/', function(req, res, next) {
    search.getIdTitle(req,function (sBar) {
        if (req.session.user) {
            //fetch data production data from db
            db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                var productionData = rows;

                //if a season has been selected, fetch episodes' data, else render the page without it
                if (req.query.seasonSelection) {
                    db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM episodes WHERE production = "${req.query.production}" AND seasonNumber = "${req.query.seasonSelection}";`, function (err, rows, fields) {

                        res.render('production', {
                            title: 'Whitefox Streaming Video',
                            user: req.session.user,
                            productionData: productionData[0],
                            season: req.query.seasonSelection,
                            episodeCount: rows.length,
                            episodeData: rows,
                            production_list: sBar
                        });
                    });
                } else {
                    console.log("No season selected");
                    res.render('production', {
                        title: 'Whitefox Streaming Video',
                        user: req.session.user,
                        productionData: productionData[0],
                        season: null,
                        episodeData: null,
                        production_list: sBar
                    });
                }
            });
        } else {
            res.redirect("/");
        }
    }
});

module.exports = router;
