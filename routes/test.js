var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");

//page for testing raw functionality

router.get('/', function(req, res, next) {

    if (req.session.user) {
        db.readOnlyConnection.query(`SELECT id, title FROM productions;`, function(err, rows, fields) {
            console.log(`Subscription should be null: ${req.session.subscriptionActiveUntil}`);
            console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);
            sub.activateSubscription(req, 1);
            console.log(`Subscription should be a month from now: ${req.session.subscriptionActiveUntil}`);
            console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);

            sub.renewSubscription(req);
            console.log(`Subscription should be two months from now: ${req.session.subscriptionActiveUntil}`);
            console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);

            // sub.cancelSubscription(req);
            // console.log(`Subscription should be null: ${req.session.subscriptionActiveUntil}`);
            // console.log(`Subscription ${sub.subscriptionActive(req) ? "is" : "is not"} active.\n`);

            var myProd = "theOffice";
            var myProd2 = "mrRobot";

            console.log(`User ${sub.hasAccessTo(req, myProd) ? "has" : "has no"} access to ${myProd}.`);
            console.log(`Requesting access to ${myProd} and ${myProd2}.`);
            console.log(`User is ${sub.requestAccessTo(req, myProd) ? "granted" : "not granted"} access to ${myProd}.`);
            console.log(`User is ${sub.requestAccessTo(req, myProd2) ? "granted" : "not granted"} access to ${myProd2}.`);
            console.log(`User ${sub.hasAccessTo(req, myProd) ? "has" : "has no"} access to ${myProd}.`);
            console.log(`User ${sub.hasAccessTo(req, myProd2) ? "has" : "has no"} access to ${myProd2}.\n`);

            console.log(`Removing access to ${myProd}.`);
            sub.removeAccessTo(req, myProd);
            console.log(`User ${sub.hasAccessTo(req, myProd) ? "has" : "has no"} access to ${myProd}.\n`);
            console.log(`Requesting access to ${myProd2} again.`);
            console.log(`User is ${sub.requestAccessTo(req, myProd2) ? "granted" : "not granted"} access to ${myProd2}.`);
            console.log(`User ${sub.hasAccessTo(req, myProd) ? "has" : "has no"} access to ${myProd}.`);
            console.log(`User ${sub.hasAccessTo(req, myProd2) ? "has" : "has no"} access to ${myProd2}.`);


            res.render('test', { title: 'Whitefox Streaming Video', message: `Welcome, ${req.session.user}!`, user: req.session.user, displayProductions: rows});
        });

    }
    else {
        res.redirect("/");
    }

});

module.exports = router;