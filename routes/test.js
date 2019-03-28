var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var prods = require("../production-helper");

//page for testing raw functionality

router.get('/', function(req, res, next) {

    if (req.session.user) {
        sub.syncSessionWithDb(req, function () {
            if (req.query.action) {
                console.log(`Performing ${req.query.action}`);
                if (req.query.action === "activateSubscription") {
                    if (!sub.subscriptionActive(req)) {
                        sub.activateSubscription(req, 10, function () {
                            console.log("About to redirect");
                            res.redirect("/test");
                        });
                    }
                    else {
                        res.redirect("/test");
                    }
                }
                else if (req.query.action === "renewSubscription") {
                    sub.renewSubscription(req, function () {
                        res.redirect("/test");
                    });
                }
                else if (req.query.action === "cancelSubscription") {
                    sub.cancelSubscription(req, function () {
                        res.redirect("/test");
                    });
                }
                else {
                    res.redirect("/test");
                }
            }
            else {
                prods.getAllFileUrls(req, "testProduction", function (fileUrls) {
                    console.log(fileUrls);

                    res.render('test', {
                        title: 'Whitefox Streaming Video',
                        message: `Welcome, ${req.session.user}!`,
                        subscriptionActiveUntil: req.session.subscriptionActiveUntil,
                        vidUrls: fileUrls
                    });
                });
            }
        });
    }
    else {
        res.redirect("/");
    }
});



module.exports = router;
