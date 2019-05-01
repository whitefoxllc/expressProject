const assert  = require('assert');

db = require("../db-helper");
user = require("../updateUser-helper");

before(function (done) {
    db.coverageRootConnection.query(`insert into users(username, emailaddress, dateOfBirth) 
                                    values('updateUserTest-1', 'revTest@rev.test', '2000-01-01 00:00:00')`, function (err, rows, fields) {
        if (err) throw err;
        db.coverageRootConnection.query(`insert into users(username, emailaddress, dateOfBirth) 
                                    values('updateUserTest-2', 'revTest@rev.test', '2000-01-01 00:00:00')`, function (err, rows, fields) {
            db.coverageRootConnection.query(`delete from users where username='updateUserTest-3'`, function (err, rows, fields) {
                db.coverageRootConnection.query(`insert into paymentcredentials values('updateUserTest-1','test','test','1234123412341234',1,2000)`, function (err, rows, fields) {
                    db.coverageRootConnection.query(`insert into userbillingaddresses(user) values('updateUserTest-1')`, function (err, rows, fields) {
                        done();
                    });
                });
            });
        });
    });
});

after(function (done) {
    db.coverageRootConnection.query(`delete from users where username like 'updateUserTest-%'`, function (err, rows, fields) {
        if (err) throw err;
            done();
    });
});

describe("production-helper", function () {

    describe("userExistsCheck-1", function () {
        it("returns true because user has billing address", function (done) {
            let req = {
                session: {
                    user: "updateUserTest-1"
                }
            };

            user.userExistsCheck(req, function (exists) {
                assert(exists);
                done();
            });
        });
    });

    describe("userExistsCheck-2", function () {
        it("returns false because user lacks a billing address", function (done) {
            let req = {
                session: {
                    user: "updateUserTest-2"
                }
            };

            user.userExistsCheck(req, function (exists) {
                assert(!exists);
                done();
            });
        });
    });

    describe("ccExistCheck-1", function () {
        it("returns true because user has payment credentials", function (done) {
            let req = {
                session: {
                    user: "updateUserTest-1"
                }
            };

            user.ccExistCheck(req, function (exists) {
                assert(exists);
                done();
            });
        });
    });

    describe("ccExistCheck-2", function () {
        it("returns false because user lacks payment credentials", function (done) {
            let req = {
                session: {
                    user: "updateUserTest-2"
                }
            };

            user.ccExistCheck(req, function (exists) {
                assert(!exists);
                done();
            });
        });
    });

    describe("stateList", function () {
        it("returns a list of all 51 US states", function (done) {
            user.stateList(null,function (rows) {
                assert.strictEqual(rows.length, 51);
                done();
            });
        });
    });
});

