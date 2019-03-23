var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var prods = require("../production-helper");

//page for testing raw functionality

router.get('/', function(req, res, next) {

    if (req.session.user) {
        sub.syncSessionWithDb(req, function () {
            sub.cancelSubscription(req, function () {
                console.log(`Subscription should be null: ${req.session.subscriptionActiveUntil}`);
                console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);
                sub.activateSubscription(req, 1, function () {
                    console.log(`Subscription should be a month from now: ${req.session.subscriptionActiveUntil}`);
                    console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);

                    sub.renewSubscription(req, function () {
                        console.log(`Subscription should be two months from now: ${req.session.subscriptionActiveUntil}`);
                        console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);

                        prods.getFileUrlFor(req, "mrRobot", 1, 1, function (fileUrl) {
                            res.render('test', {
                                title: 'Whitefox Streaming Video',
                                message: `Welcome, ${req.session.user}!`,
                                user: req.session.user,
                                vidUrl: fileUrl
                            });
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
