const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
prod = require("../production-helper");

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

describe("production-helper", function () {
    // describe("getFileUrlFor", function () {
    //     it("gets a file urlt", function () {
    //         assert.strictEqual(login.hash("test"), "test");
    //     });
    // });


});