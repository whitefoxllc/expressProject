var express = require('express');
var router = express.Router();

var db = require("../db-helper");
var sub = require("../subscription-helper");
var search = require("../search-helper");
var account = require("../updateUser-helper");
var currentPass;

router.get('/', function(req, res, next) {
    search.getAllIdsTitles(req,function (find) {
        search.getAllGenres(req, function (findGenre) {
            account.userExistsCheck(req,function (exists) {
                account.ccExistCheck(req, function (ccExists) {
                    account.stateList(req, function (stateL) {
                        const accountQuery = `SELECT *  FROM users WHERE username = "${req.session.user}"`;
                        const addressQuery = `SELECT * FROM userBillingAddresses WHERE user = "${req.session.user}"`;
                        const cardQuery = `SELECT ccNumber FROM paymentCredentials WHERE user = "${req.session.user}"`;
                        db.readOnlyConnection.query(accountQuery, (err, rows, fields) => {
                            if (exists && ccExists) {
                                db.readOnlyConnection.query(addressQuery, (err, address, fields) => {
                                    db.readOnlyConnection.query(cardQuery, (err, card, fields) => {
                                        console.log("pass " + rows[0].autoRenewalEnabled);
                                        currentPass=rows[0].plainTextPasswordLol;
                                        console.log("Current " + currentPass);
                                        var lastFour = card[0].ccNumber;
                                        lastFour = lastFour.replace(/.(?=.{4})/g, '•');
                                        console.log("last 4" + lastFour);
                                        res.render('account', {
                                            user: req.session.user,
                                            email: rows[0].emailaddress,
                                            name: rows[0].displayName,
                                            dateCreated: rows[0].dateCreated,
                                            status: rows[0].autoRenewalEnabled,
                                            password: "••••••••••••••••••",
                                            production_list: find,
                                            genre_list: findGenre,
                                            ccNumber: lastFour,
                                            str1: address[0].streetLine1,
                                            str2: address[0].streetLine2,
                                            state: address[0].state,
                                            zip: address[0].zipCode,
                                            country: address[0].country,
                                            stateList: stateL,
                                            maxSlots: req.session.slotsAllowed,
                                            currentSlots: req.session.activeSlots

                                        });
                                        console.log("auto Renew" + rows[0].autoRenewalEnabled)
                                    });
                                });
                            } else if (!exists && !ccExists) {
                                currentPass=rows[0].plainTextPasswordLol;
                                res.render('account', {
                                    user: req.session.user,
                                    email: rows[0].emailaddress,
                                    name: rows[0].displayName,
                                    dateCreated: rows[0].dateCreated,
                                    status: rows[0].autoRenewalEnabled,
                                    password: "••••••••••••••••••",
                                    production_list: find,
                                    genre_list: findGenre,
                                    stateList: stateL,
                                    maxSlots: req.session.slotsAllowed,
                                    currentSlots: req.session.activeSlots
                                });
                            } else if (!exists && ccExists) {
                                currentPass=rows[0].plainTextPasswordLol;
                                db.readOnlyConnection.query(cardQuery, (err, card, fields) => {
                                    res.render('account', {
                                        user: req.session.user,
                                        email: rows[0].emailaddress,
                                        name: rows[0].displayName,
                                        dateCreated: rows[0].dateCreated,
                                        status: rows[0].autoRenewalEnabled,
                                        password: "••••••••••••••••••",
                                        production_list: find,
                                        genre_list: findGenre,
                                        ccNumber: card[0].ccNumber,
                                        stateList: stateL,
                                        maxSlots: req.session.slotsAllowed,
                                        currentSlots: req.session.activeSlots
                                    });
                                });
                            } else {
                                currentPass=rows[0].plainTextPasswordLol;
                                console.log("CCC " + currentPass);
                                db.readOnlyConnection.query(addressQuery, (err, address, fields) => {
                                    res.render('account', {
                                        user: req.session.user,
                                        email: rows[0].emailaddress,
                                        name: rows[0].displayName,
                                        dateCreated: rows[0].dateCreated,
                                        status: rows[0].autoRenewalEnabled,
                                        password: "••••••••••••••••••",
                                        production_list: find,
                                        genre_list: findGenre,
                                        str1: address[0].streetLine1,
                                        str2: address[0].streetLine2,
                                        state: address[0].state,
                                        zip: address[0].zipCode,
                                        country: address[0].country,
                                        stateList: stateL,
                                        maxSlots: req.session.slotsAllowed,
                                        currentSlots: req.session.activeSlots
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});
router.post('/', function(req, res) {

    if (typeof req.body.displayName !== 'undefined') {
        db.writeUsersConnection.query(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`, function (err, rows, fields) {
            console.log(`UPDATE users SET displayName = "${req.body.displayName}" WHERE username= "${req.session.user}";`);
            console.log("new name " + req.body.displayName + " name: " + req.session.user)
            res.redirect('/account');
        });
    }
    else if (typeof req.body.password !== 'undefined') {
        console.log("pass Current " + currentPass + " old pass " + req.body.oldpass);
        if (req.body.oldpass == currentPass) {
            db.writeUsersConnection.query(`UPDATE users SET plainTextPasswordLol = "${req.body.password}" Where username = "${req.session.user}";`, function (err, rows, fields) {
                console.log("pass Current " + currentPass + " old pass " + req.body.oldpass);
                res.redirect('/account');
            });
        }
        else {
            res.status(204).send("Enter");
        }
    }
    else if (typeof req.body.email !== 'undefined')
    {
        db.writeUsersConnection.query(`UPDATE users SET emailaddress = "${req.body.email}" Where username = "${req.session.user}";`,function (err,rows,fields) {
            res.redirect('/account');
        });
    }
    else if (typeof req.body.str1 !== 'undefined')
    {
        console.log("str1 " + req.body.str1);
        db.writeUsersConnection.query(`SELECT user FROM userBillingAddresses WHERE user = "${req.session.user}";`, function (err,rows,fields) {
           if (rows.length > 0) {
               db.writeUsersConnection.query(`UPDATE userBillingAddresses SET  streetLine1 = "${req.body.str1}", streetLine2 ="${req.body.str2}", state = "${req.body.state}", zipCode = "${req.body.zip}", country = "${req.body.country}" Where user = "${req.session.user}";`,
                   function () {
                       console.log("state " + req.body.state);
                       res.redirect('/account');
                   });
           }
           else {
               console.log("user not in billingAddresses");
               db.writeUsersConnection.query(`INSERT INTO userBillingAddresses (user,streetLine1,streetLine2,state,zipCode,country) values ("${req.session.user}","${req.body.str1}","${req.body.str2}", "${req.body.state}","${req.body.zip}","${req.body.country}");`,function (err,rows,fields) {
                   console.log(req.session.user + " inserted into Billing Address");
                   res.redirect('/account');
               });
           }
        });
    }
    else if (typeof  req.body.cardFName !== 'undefined')
    {
        db.writeUsersConnection.query(`SELECT user FROM paymentCredentials WHERE user = "${req.session.user}";`, function (err,rows,fields) {
           if (rows.length > 0)
           {
               db.writeUsersConnection.query(`UPDATE paymentCredentials SET firstName= "${req.body.cardFName}", lastName="${req.body.cardLName}", ccNumber="${req.body.cardNumber}", ccExpirationMonth="${req.body.cardMonth}", ccExpirationYear = "${req.body.cardYear}";`,
                   function () {
                      res.redirect('/account');
                   });
           }
           else {
               db.writeUsersConnection.query(`INSERT INTO paymentCredentials (user,firstName,lastName,ccNumber,ccExpirationMonth,ccExpirationYear) Values ("${req.session.user}","${req.body.cardFName}","${req.body.cardLName}","${req.body.cardNumber}","${req.body.cardMonth}","${req.body.cardYear}");`,
                   function () {
                       res.redirect('/account');
                   });
           }
        });
    }
    else if (typeof req.body.auto !== 'undefined' || typeof req.body.off !== 'undefined')
    {
        console.log("auto Renew enabled " + req.body.auto +" disabled " + req.body.off);
        if (req.body.auto == 1){
            db.writeUsersConnection.query(`UPDATE users SET  autoRenewalEnabled = "${req.body.auto}" WHERE username= "${req.session.user}";`, function (err, rows, fields) {
                res.redirect('/account');
            });
        }
        else{
            db.writeUsersConnection.query(`UPDATE users SET  autoRenewalEnabled = "${req.body.off}" WHERE username= "${req.session.user}";`, function (err, rows, fields) {
                res.redirect('/account');
            });
        }
        
    }
    else if(typeof req.body.plan !== 'undefined')
    {
        console.log("Plan " + req.body.plan + " slots Allowed " + req.session.slotsAllowed);
        db.writeUsersConnection.query(`SELECT subscriber FROM subscriptions WHERE subscriber = "${req.session.user}";`, function (err,rows,fields) {
            if (rows.length > 0) {
                db.writeUsersConnection.query(`UPDATE subscriptions SET slotCount = "${req.body.plan}" WHERE subscriber = "${req.session.user}";`,
                    function (err, rows, fields) {
                        req.session.slotsAllowed = req.body.plan;
                        res.redirect('/account');
                    });
            } else {
                console.log('Not in subscriptions: Expiriry ' + req.session.subscriptionActiveUntil);

               sub.activateSubscription(req,req.body.plan, function () {
                  res.redirect('/account');
               });
            }
        });
    }
});

module.exports = router;
