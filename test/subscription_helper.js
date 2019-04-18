const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
subs = require("../subscription-helper");



    //dummy variables used to simulate valid requests
var now = new Date();

var later = new Date();
later.setDate(later.getDate() + 30);

var dummyReq = {
    session: {}
};

const dummySlots = ["dummy"];
const farDate = '5000-00-00';
const maxSlots = 127;
console.log();

before(function (done) {
    db.coverageRootConnection.query(
        "delete from users where username='coverage'; " +
        "insert into users values ('coverage', 'emailaddress', '" + farDate + "', null, 'displayName', '" + farDate + " 00:00:00', 1, 'plainTextPasswordLol'); " +
        "insert into subscriptions values ('coverage', '" + farDate + " 00:00:00', " + maxSlots +"); " +
        "insert into slots values ('coverage', 'testProduction', '" + farDate + " 00:00:00'); "
        , done());
});

//this needs to end up as a connection pool so it can be closed in one go, but I'll do that later
after(function (done) {
    console.log("Testing complete - closing db connections!");
    db.coverageRootConnection.end(function () {
        done();
    });
});



describe("subscription-helper", function () {
    describe("clearSessionSubscriptionData", function () {
        it("clears the four relevant session variables", function () {
            dummyReq.session = {
                subscriptionActiveUntil: later,
                slotsAllowed: 50,
                activeSlots: 1,
                slots: dummySlots
            };

            assert.strictEqual(dummyReq.session.subscriptionActiveUntil, later);
            assert.strictEqual(dummyReq.session.slotsAllowed, 50);
            assert.strictEqual(dummyReq.session.activeSlots, 1);
            assert.strictEqual(dummyReq.session.slots, dummySlots);

            subs.clearSessionSubscriptionData(dummyReq);

            assert.strictEqual(dummyReq.session.subscriptionActiveUntil, null);
            assert.strictEqual(dummyReq.session.slotsAllowed, 0);
            assert.strictEqual(dummyReq.session.activeSlots, 0);
            assert.strictEqual(dummyReq.session.slots.length, 0);

        });
    });

    describe("syncSessionWithDb", function () {
        it("syncs current session with db values for user", function (done) {
            dummyReq.session = {
                user: "coverage",
            };
            subs.syncSessionWithDb(dummyReq, function () {
                assert.strictEqual(dummyReq.session.subscriptionActiveUntil, (farDate + " 00:00:00"));
                assert.strictEqual(dummyReq.session.slotsAllowed, maxSlots);
                assert.strictEqual(dummyReq.session.activeSlots, 1);
                assert.strictEqual(dummyReq.session.slots[0].productionID, 'testProduction');
                assert.strictEqual(dummyReq.session.slots[0].expiryDate, '5000-00-00 00:00:00');
                assert.strictEqual(true, true);
                done();
            });
        });
    });

    describe("activateSubscription", function () {
        it("activates a subscription", function (done) {
            subs.clearSessionSubscriptionData(dummyReq);
            db.coverageRootConnection.query(`delete from subscriptions where subscriber="coverage";`, function () {
                const TEMPSLOTS = 50;
                subs.activateSubscription(dummyReq, TEMPSLOTS, function () {
                    var approximateExpiry = new Date();
                    approximateExpiry.setDate(approximateExpiry.getDate() + 30);
                    assert((approximateExpiry - dummyReq.session.subscriptionActiveUntil) < 1000);
                    assert.strictEqual(dummyReq.session.slotsAllowed, TEMPSLOTS);
                    assert.strictEqual(dummyReq.session.activeSlots, 0);
                    assert.strictEqual(dummyReq.session.slots.length, 0);
                    done();
                })
            })
        });
    });

    describe("renewSubscription", function () {
        it("adds 30 days to the expiry date of a subscription", function (done) {
            subs.renewSubscription(dummyReq, function () {
                subs.syncSessionWithDb(dummyReq, function () {
                    var approximateExpiry = new Date();
                    approximateExpiry.setDate(approximateExpiry.getDate() + 60);
                    assert((dummyReq.session.subscriptionActiveUntil.getDate() - approximateExpiry.getDate()) <= 1);
                    done();
                });
            })
        });
    });

    describe("cancelSubscription", function () {
        it("cancels a subscription", function (done) {
            subs.cancelSubscription(dummyReq, function () {
                subs.syncSessionWithDb(dummyReq, function () {
                    assert.strictEqual(dummyReq.session.subscriptionActiveUntil, null);
                    assert.strictEqual(dummyReq.session.slotsAllowed, 0);
                    assert.strictEqual(dummyReq.session.activeSlots, 0);
                    assert.strictEqual(dummyReq.session.slots.length, 0);
                    done();
                })
            })
        });
    });

    // describe("subscriptionActive", function () {
    //     it("returns whether a subscription is active or not", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
    //
    // describe("hasAccessTo", function () {
    //     it("returns whether or not a user has an active slot for a production", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
    //
    // describe("grantAccessTo", function () {
    //     it("creates a slot for a user and production with an expiry 30 days out", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
    //
    // describe("requestAccessTo", function () {
    //     it("grants access to a user for a production iff user has an existing slot for that production or a free slot", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
    //
    // describe("removeAccessTo", function () {
    //     it("description", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
    //
    // describe("removeAccessTo", function () {
    //     it("removes a user's slot for a production", function () {
    //         assert.strictEqual(true, true);
    //     });
    // });
});

