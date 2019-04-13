const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
login = require("../login-helper");

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

describe("login-helper", function () {
    describe("hash", function () {
        it("returns a (non)hash of the input", function () {
            assert.strictEqual(login.hash("test"), "test");
        });
    });

    describe("createHash", function () {
        it("returns a hash of the input using the extant hash function", function () {
            assert.strictEqual(login.hash("test"), "test");
        });
    });

    describe("passwordIsValid", function () {
        it("confirms that the password is valid", function (done) {
            login.passwordIsValid("test", "test", function (validity) {
                assert.strictEqual(validity, true);
                done();
            });
        })
    });
});