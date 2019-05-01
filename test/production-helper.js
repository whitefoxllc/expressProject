const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
subs = require("../subscription-helper");
dates = require("../date-helper");
prods = require("../production-helper");




//dummy variables used to simulate valid requests
var now = new Date();
var oneMonthFromNow = new Date();
oneMonthFromNow.setDate(now.getDate() + 30);

const dummySlotArray = [{productionID:"testProduction", expiryDate:oneMonthFromNow}];
const maxSlots = 127;

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
        done();
    });
});

describe("production-helper", function () {

    describe("getFileUrlFor-1", function (done) {
        it("gets a file url for a user with valid access", function (done) {
            makeDummyReq("getFileUrlFor-1", true, dummySlotArray, false, function (req) {
                db.coverageRootConnection.query(`select fileURL from episodes where production='${dummySlotArray[0].productionID}' and seasonNumber='1' and episodeNumber='1'`, function (err, rows, fields) {
                    if (err) throw err;
                    let testUrl = rows[0].fileURL;
                    prods.getFileUrlFor(req, dummySlotArray[0].productionID, 1, 1, function (url) {
                        assert.strictEqual(url, testUrl);
                        done();
                    });
                });
            });
        });
    });

    describe("getFileUrlFor-2", function (done) {
        it("fails to get a file url for a user with no access", function (done) {
            makeDummyReq("getFileUrlFor-2", false, [], false, function (req) {
                db.coverageRootConnection.query(`select fileURL from episodes where production='${dummySlotArray[0].productionID}' and seasonNumber='1' and episodeNumber='1'`, function (err, rows, fields) {
                    if (err) throw err;
                    let testUrl = rows[0].fileURL;
                    prods.getFileUrlFor(req, dummySlotArray[0].productionID, 1, 1, function (url) {
                        assert.strictEqual(url, null);
                        done();
                    });
                });
            });
        });
    });

    describe("getAllFileUrls-1", function (done) {
        it("gets a set of file Urls and episode titles for a user with valid access", function (done) {
            makeDummyReq("getAllFileUrls-1", true, dummySlotArray, false, function (req) {
                db.coverageRootConnection.query(`select title, fileURL, seasonNumber, episodeNumber from episodes where production='${dummySlotArray[0].productionID}' order by seasonNumber, episodeNumber`, function (err, rows, fields) {
                    if (err) throw err;
                    prods.getAllFileUrls(req, dummySlotArray[0].productionID, function (urls) {
                        rows.forEach(function (element) {
                            assert.strictEqual(urls[element.seasonNumber][element.episodeNumber].url, element.fileURL);
                            assert.strictEqual(urls[element.seasonNumber][element.episodeNumber].title, element.title);
                        });
                        done();
                    });
                });
            });
        });
    });

    describe("getAllFileUrls-2", function (done) {
        it("fails to get a set of file Urls and episode titles for a user without access", function (done) {
            makeDummyReq("getAllFileUrls-2", false, [], false, function (req) {
                prods.getAllFileUrls(req, dummySlotArray[0].productionID, function (urls) {
                    assert.strictEqual(urls, null);
                    done();
                });
            });
        });
    });
});

