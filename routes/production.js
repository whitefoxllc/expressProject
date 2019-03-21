var express = require('express');
var router = express.Router();

var db = require("../db-helper");

router.get('/', function(req, res, next) {
    console.log("Git got");
    if (req.session.user) {
        db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function(err, rows, fields) {
            var productionData = rows;
            console.log(`SELECT * FROM productions where id = "${req.query.production}";`);
            console.log(productionData);

            if (req.query.seasonSelection) {
                console.log(`Season ${req.query.seasonSelection} selected`);
                db.readOnlyConnection.query(`SELECT episodeNumber, title, fileURL FROM seasons where production = "${req.body.production}";`, function(err, rows, fields) {
                    console.log(`SELECT episodeNumber, title, fileURL FROM seasons where production = "${req.body.production}";`);
                    console.log(rows);

                    res.render('production', {
                        title: 'Whitefox Streaming Video',
                        user: req.session.user,
                        productionData: productionData,
                        season: req.query.seasonSelection,
                        episodeData: rows
                    });
                });
            }
            else {
                console.log("No season selected");
                res.render('production', {
                    title: 'Whitefox Streaming Video',
                    user: req.session.user,
                    productionData: productionData[0],
                    season: null,
                    episodeData: null
                });
            }
        });
    }
    else {
        res.redirect("/");
    }

});

module.exports = router;