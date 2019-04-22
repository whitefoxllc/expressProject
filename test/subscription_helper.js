const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
subs = require("../subscription-helper");
dates = require("../date-helper");



    //dummy variables used to simulate valid requests
var now = new Date();
var oneMonthFromNow = new Date();
oneMonthFromNow.setDate(now.getDate() + 30);

var farLater = new Date('January 1, 5000 00:00:00');
var farLaterStr = "5000-00-00 00:00:00";

const dummySlotArray = [{productionID:"testProduction", expiryDate:oneMonthFromNow}];
const maxSlots = 127;
console.log();

var testUsers = [];

function makeDummyReq(username, subscriptionActive, slotsArray, createSpareSlots, callback) {
    req = {
        session: {
            user: username,
            subscriptionActiveUntil: subscriptionActive ? oneMonthFromNow : null,
            slotsAllowed: createSpareSlots ? maxSlots : slotsArray.length,
            activeSlots: slotsArray.length,
            slots: slotsArray
        }
    };

    if (!subscriptionActive) {
        req.session.slotsAllowed = 0;
        req.session.activeSlots = 0;
    }

    testUsers.push(req.session.user);
    let creationQueriesString = `INSERT INTO users (username, emailaddress, dateCreated, plaintextPasswordLol) VALUES ("${username}", "emailaddress", NOW(), "plainTextPasswordLol");`;

    if (subscriptionActive) {
        creationQueriesString += `insert into subscriptions values('${req.session.user}', '${dates.dateToSqlDatetime(req.session.subscriptionActiveUntil)}', '${req.session.slotsAllowed}');`;
    }

    slotsArray.forEach(function (element) {
        creationQueriesString += `insert into slots values('${req.session.user}','${element.productionID}','${dates.dateToSqlDatetime(element.expiryDate)}');`;
    });

    db.coverageRootConnection.query(creationQueriesString, function (err, rows, fields) {
        if (err) throw err;
        return callback(req);
    });
}

before(function (done) {
    done();
});

//this needs to end up as a connection pool so it can be closed in one go, but I'll do that later
after(function (done) {
    let queryString = `delete from users where `;
    testUsers.forEach(function (name) {
        queryString += `username='${name}'`;
        if (name !== testUsers[testUsers.length - 1]) {
            queryString += ` or `;
        } else {
            queryString += `;`;
        }
    });

    db.coverageRootConnection.query(queryString, function (err, rows, fields) {
        if (err) throw err;
        console.log("Testing complete - closing db connections!");
        db.coverageRootConnection.end(function () {
            console.log("Connections successfully closed!");
            done();
        });
    });
});

describe("subscription-helper", function () {

    describe("clearSessionSubscriptionData", function () {
        it("clears the four relevant session variables", function (done) {
            makeDummyReq("clearSessionSubscriptionData", true, dummySlotArray, true, function (req) {
                assert.strictEqual(req.session.subscriptionActiveUntil, oneMonthFromNow);
                assert.strictEqual(req.session.slotsAllowed, maxSlots);
                assert.strictEqual(req.session.activeSlots, 1);
                assert.strictEqual(req.session.slots, dummySlotArray);

                subs.clearSessionSubscriptionData(req);

                assert.strictEqual(req.session.subscriptionActiveUntil, null);
                assert.strictEqual(req.session.slotsAllowed, 0);
                assert.strictEqual(req.session.activeSlots, 0);
                assert.strictEqual(req.session.slots.length, 0);
                done()
            });
        });
    });

    describe("syncSessionWithDb", function () {
        it("syncs current session with db values for user", function (done) {
            makeDummyReq("syncSessionWithDb", true, dummySlotArray, true, function (req) {
                subs.clearSessionSubscriptionData(req);
                subs.syncSessionWithDb(req, function () {
                    assert(dates.timesAreApproximatelyEqual(req.session.subscriptionActiveUntil, oneMonthFromNow));
                    assert.strictEqual(req.session.slotsAllowed, maxSlots);
                    assert.strictEqual(req.session.activeSlots, 1);
                    assert.strictEqual(req.session.slots[0].productionID, 'testProduction');
                    assert(dates.timesAreApproximatelyEqual(req.session.slots[0].expiryDate, oneMonthFromNow));
                    assert.strictEqual(true, true);
                    done();
                });
            });
        });
    });

    describe("activateSubscription", function () {
        it("activates a subscription", function (done) {
            makeDummyReq("activateSubscription", false, [], false, function (req) {
                assert(!req.session.subscriptionActiveUntil);
                subs.activateSubscription(req, maxSlots, function () {
                    var approximateExpiry = new Date();
                    approximateExpiry.setDate(approximateExpiry.getDate() + 30);
                    assert(dates.timesAreApproximatelyEqual(req.session.subscriptionActiveUntil, oneMonthFromNow));
                    assert.strictEqual(req.session.slotsAllowed, maxSlots);
                    assert.strictEqual(req.session.activeSlots, 0);
                    assert.strictEqual(req.session.slots.length, 0);
                    done();
                })
            });
        });
    });
    //
    // describe("renewSubscription", function () {
    //     it("adds 30 days to the expiry date of a subscription", function (done) {
    //         subs.renewSubscription(dummyReq, function () {
    //             subs.syncSessionWithDb(dummyReq, function () {
    //                 var approximateExpiry = new Date();
    //                 approximateExpiry.setDate(approximateExpiry.getDate() + 60);
    //                 assert((dummyReq.session.subscriptionActiveUntil.getDate() - approximateExpiry.getDate()) <= 1);
    //                 done();
    //             });
    //         })
    //     });
    // });
    //
    // describe("cancelSubscription", function () {
    //     it("cancels a subscription", function (done) {
    //         subs.cancelSubscription(dummyReq, function () {
    //             subs.syncSessionWithDb(dummyReq, function () {
    //                 assert.strictEqual(dummyReq.session.subscriptionActiveUntil, null);
    //                 assert.strictEqual(dummyReq.session.slotsAllowed, 0);
    //                 assert.strictEqual(dummyReq.session.activeSlots, 0);
    //                 assert.strictEqual(dummyReq.session.slots.length, 0);
    //                 done();
    //             })
    //         })
    //     });
    // });

    // describe("subscriptionActive", function () {
    //     dummyReq.session.user = `${testUsername}`;
    //     it("returns false because no subscription is active", function (done) {
    //         db.coverageRootConnection.query(`delete from subscriptions where subscriber="${testUsername}";`, function () {
    //             assert.strictEqual(subs.subscriptionActive(dummyReq), false);
    //             done();
    //         });
    //     });
    //
    //     it("returns true because a subscription is active", function (done) {
    //         subs.activateSubscription(dummyReq, 25, function () {
    //             assert.strictEqual(subs.subscriptionActive(dummyReq), true);
    //             done();
    //         })
    //     });
    //
    //
    //
    // });
    //
    // describe("hasAccessTo", function () {
    //     it("returns whether or not a user has an active slot for a production", function () {
    //         it("returns false because no slot exists", function (done) {
    //             db.coverageRootConnection.query(`delete from slots where subscriber="${testUsername}";`, function () {
    //                 assert.strictEqual(subs.hasAccessTo(dummyReq, "testProduction"), false);
    //                 done();
    //             });
    //         });
    //
    //         it("returns true because a subscription is active", function (done) {
    //             db.coverageRootConnection.query(`insert into slots values("${testUsername}", "testProduction", ${later});`, function () {
    //                 assert.strictEqual(subs.hasAccessTo(dummyReq, "testProduction"), true);
    //                 done();
    //             })
    //         });
    //     });
    // });
    //
    // describe("grantAccessTo", function () {
    //     it("creates a slot for a user and production with an expiry 30 days out", function (done) {
    //         dummyReq.session.slotsAllowed = 25;
    //         db.coverageRootConnection.query(`delete from slots where subscriber="${testUsername}";`, function () {
    //             subs.grantAccessTo(dummyReq, "testProduction", function () {
    //                 assert.strictEqual(subs.hasAccessTo(dummyReq, "testProduction"), true);
    //                 done();
    //             });
    //         });
    //     });
    //
    //     it("fails to create a slot for a user and production", function (done) {
    //         dummyReq.session.slotsAllowed = 0;
    //         dummyReq.session.slots = [];
    //         db.coverageRootConnection.query(`delete from slots where subscriber="${testUsername}";`, function () {
    //             subs.grantAccessTo(dummyReq, "testProduction", function () {
    //                 assert.strictEqual(subs.hasAccessTo(dummyReq, "testProduction"), false);
    //                 subs.syncSessionWithDb(dummyReq, done); //reset session variables
    //             });
    //         });
    //     });
    // });
    //
    // describe("requestAccessTo", function () {
    //     it("permits access to a user for a production because user has a free slot", function (done) {
    //         db.coverageRootConnection.query(`delete from slots where subscriber='${testUsername}';`, function () {
    //             subs.cancelSubscription(dummyReq, function () {
    //                 subs.activateSubscription(dummyReq, 1, function () {
    //                     subs.requestAccessTo(dummyReq, "testProduction", function () {
    //                         assert(subs.hasAccessTo(dummyReq, "testProduction"));
    //                         done();
    //                     })
    //                 })
    //             });
    //         });
    //     });
    //
    //     it("permits access to a user for a production because user has an existing slot for that production", function (done) {
    //         subs.requestAccessTo(dummyReq, "testProduction", function () {
    //             assert(subs.hasAccessTo(dummyReq, "testProduction"));
    //             done();
    //         })
    //     });
    //
    //     it("refuses access to a user for a production because user lacks an existing slot for that production or a free slot", function (done) {
    //         db.coverageRootConnection.query(`delete from slots where subscriber='${testUsername}';`, function () {
    //             dummyReq.session.slots = [];
    //             subs.cancelSubscription(dummyReq, function () {
    //                 subs.activateSubscription(dummyReq, 0, function () {
    //                     subs.requestAccessTo(dummyReq, "testProduction", function () {
    //                         assert(!subs.hasAccessTo(dummyReq, "testProduction"));
    //                         done();
    //                     })
    //                 })
    //             });
    //         });
    //     });
    // });

    // describe("removeAccessTo", function () {
    //     it("erases a slot", function (done) {
    //         subs.syncSessionWithDb(dummyReq, function () {
    //             subs.cancelSubscription(dummyReq, function () {
    //                 subs.activateSubscription(dummyReq, 25, function () {
    //                     subs.requestAccessTo(dummyReq, "testProduction", function () {
    //                         assert(subs.hasAccessTo(dummyReq, "testProduction"));
    //                         subs.removeAccessTo(dummyReq, "testProduction", function () {
    //                             assert(!subs.hasAccessTo(dummyReq, "testProduction"));
    //                             done();
    //                         });
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // });

    // describe("removeAccessTo", function () {
    //     it("removes a user's slot for a production", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
});

