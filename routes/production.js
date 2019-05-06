var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var search = require("../search-helper");
var subs = require("../subscription-helper");
var prods = require("../production-helper");
var revs = require("../comment-helper");

router.get('/', function(req, res, next) {

    if (req.session.user) {
        subs.syncSessionWithDb(req, function () {
            revs.productionReviews(req, req.query.production, function(prodReviews) {
                search.getAllIdsTitles(req, function (allProductions) {
                    search.getAllGenres(req, function (genres) {
                        db.readOnlyConnection.query(`SELECT * FROM productions where id = "${req.query.production}";`, function (err, rows, fields) {
                            var productionData = rows;
                            var seasonSelection = req.query.seasonSelection ? req.query.seasonSelection : 1;
                            var episodeSelection = req.query.episodeSelection ? req.query.episodeSelection : null;
                            prods.getAllFileUrls(req, req.query.production, function (epData) {
                                res.render('production', {
                                    title: 'Whitefox Streaming Video',
                                    user: req.session.user,
                                    productionData: productionData[0],
                                    selectedSeason: seasonSelection,
                                    selectedEpisode: episodeSelection,
                                    episodeCount: epData ? (epData[seasonSelection].length - 1) : 0,
                                    episodeData: epData,
                                    production_list: allProductions,
                                    genre_list: genres,
                                    maxSlots: req.session.slotsAllowed,
                                    currentSlots: req.session.activeSlots,
                                    slots: req.session.slots,
                                    reviews: prodReviews
                                });
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

    //comment post
    router.post('/', function(req, res, next){
        if (typeof req.body.prod !== 'undefined'){
            //ricardos stuff
                subs.requestAccessTo(req,req.body.prod, function (success) {
                    if(success) {
                        res.redirect('back');
                    }
                });

        }else {

            revs.reviewExistCheck(req.session.user, req.body.prodset, function (exists) {
                if (exists) {
                    //update review
                    revs.updateReview(req.session.user, req.body.prodset, req.body.ratingnumber, req.body.comment, function () {
                        console.log('comment updated');
                    });
                    res.redirect('back');
                } else {
                    //write reviews
                    revs.writeReview(req.session.user, req.body.prodset, req.body.ratingnumber, req.body.comment, function () {
                        console.log('comment added');
                        res.redirect('back');
                    });
                }
            });
        }

    });
});

/*router.post('/', function(req,res){
    subs.requestAccessTo(req,req.body.prod, function (success) {
        if(success) {
            res.redirect('back');
        }
    });

});
*/



module.exports = router;
