const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
subs = require("../subscription-helper");

//this needs to end up as a connection pool so it can be closed in one go, but I'll do that later
after(function (done) {
    db.readOnlyConnection.end(function () {
        db.sessionStoreConnection.end(function () {
            db.writeProdsConnection.end(function () {
                db.writeSubscriptionsConnection.end(function () {
                    db.writeUsersConnection.end(function () {
                        done();
                    });
                });
            });
        });
    });
});

    //dummy variables used to simulate valid requests
var now = new Date();

var later = new Date();
later.setDate(later.getDate() + 30);

var dummyReq = {
    session: {}
};

describe("subscription-helper", function () {
    describe("clearSessionSubscriptionData", function () {
        it("clears the four relevant session variables", function () {
            dummyReq.session = {
                subscriptionActiveUntil: later,
                slotsAllowed: 50,
                activeSlots: 5,
                slots: ["dummy", "dummy", "dummy", "dummy", "dummy"]
            };

            subs.clearSessionSubscriptionData(dummyReq);

            assert.strictEqual(dummyReq.session.subscriptionActiveUntil, null);
            assert.strictEqual(dummyReq.session.slotsAllowed, 0);
            assert.strictEqual(dummyReq.session.activeSlots, 0);
            assert.strictEqual(dummyReq.session.slots.size, 0);

        });
    });


});