const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
revs = require("../review-helper");

before(function (done) {
    db.coverageRootConnection.query(`delete from users where username like 'revTest%'`, function (err, rows, fields) {
        if (err) throw err;
        db.coverageRootConnection.query(`delete from productions where id='revTest';`, function (err, rows, fields) {
            if (err) throw err;
            db.coverageRootConnection.query(`insert into users(username, emailaddress, dateOfBirth) 
                                    values('revTest1', 'revTest@rev.test', '2000-01-01 00:00:00')`, function (err, rows, fields) {
                if (err) throw err;
                db.coverageRootConnection.query(`insert into users(username, emailaddress, dateOfBirth) 
                                        values('revTest2', 'revTest@rev.test', '2000-01-01 00:00:00')`, function (err, rows, fields) {
                    if (err) throw err;
                    db.coverageRootConnection.query(`insert into productions 
                                            values ('revTest', 'hbo', 'revTest', '1', '', 'review-helper test file', '0', null)`, function (err, rows, fields) {
                        if (err) throw err;
                        db.coverageRootConnection.query(`insert into reviews
                                                 values ('revTest1', 'revTest', '2000-01-01 00:00:00', 10, 'revTest text')`, function (err, rows, fields) {
                            if (err) throw err;
                            db.coverageRootConnection.query(`insert into reviews
                                                     values ('revTest2', 'revTest', '2000-01-01 00:00:00', 0, 'revTest text')`, function (err, rows, fields) {
                                if (err) throw err;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

});

after(function (done) {
    db.coverageRootConnection.query(`delete from users where username like 'revTest%'`, function (err, rows, fields) {
        if (err) throw err;
        db.coverageRootConnection.query(`delete from productions where id='revTest';`, function (err, rows, fields) {
            if (err) throw err;
            done();
        });
    });
});

describe("production-helper", function () {

    describe("createReview", function () {
        it("creates a review JSON", function () {
            let dummyReviewJSON = revs.createReview("revTest", 10, "testText");
            assert.strictEqual(dummyReviewJSON.production, "revTest");
            assert.strictEqual(dummyReviewJSON.rating, 10);
            assert.strictEqual(dummyReviewJSON.text, "testText");
        });
    });

    describe("updateAverageReviewScore", function () {
        it("updates the avg review score to the correct value", function (done) {
            revs.updateAverageReviewScore("revTest", function () {
                db.coverageRootConnection.query(`select ratingAverage
                                                 from productions
                                                 where id = 'revTest'`, function (err, rows, fields) {
                    assert.strictEqual(rows[0].ratingAverage, 5);
                    done();
                });
            });
        });
    });

    describe("submitReview", function () {
        it("submits a review and updates the average review score", function (done) {
            let dummyReviewJSON = revs.createReview("revTest", 10, "testText");
            let dummyReq = {
                session: {
                    user: "revTest2"
                }
            }
            revs.submitReview(dummyReq, dummyReviewJSON, function () {
                db.coverageRootConnection.query(`select ratingAverage
                                                 from productions
                                                 where id = 'revTest'`, function (err, rows, fields) {
                    assert.strictEqual(rows[0].ratingAverage, 10);
                    done();
                });
            })
        });
    });



});

