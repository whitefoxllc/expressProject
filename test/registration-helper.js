const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
reg = require("../registration-helper");

var testUsers = ["createUser", "userExistsCheck-1"];
var dummyUserJsons = {};


before(function (done) {
    testUsers.forEach(function (functionName) {
        dummyUserJsons[functionName] = {
            username: functionName,
            email: functionName + "TestEmail",
            password: functionName + "TestPassword"
        };
    });

    db.coverageRootConnection.query(`delete from users where username='userExistsCheck-1' or username='createUser'`, function (err, rows, fields) {
        done();
    })
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

describe("login-helper", function () {
    describe("createUser", function () {
        it("creates a user", function (done) {
            reg.userExistsCheck("createUser", function (exists) {
                assert(!exists);
                reg.createUser(dummyUserJsons.createUser, function () {
                    db.coverageRootConnection.query(`select * from users where username='${dummyUserJsons.createUser.username}'`, function (err, rows, fields) {
                        assert.strictEqual(rows[0].username, dummyUserJsons.createUser.username);
                        assert.strictEqual(rows[0].emailaddress, dummyUserJsons.createUser.email);
                        assert.strictEqual(rows[0].plainTextPasswordLol, dummyUserJsons.createUser.password);
                        done();
                    });
                });
            });
        });
    });

    describe("userExistsCheck-1", function () {
        it("returns true because user exists", function (done) {
            reg.userExistsCheck("userExistsCheck-1", function (exists) {
                assert(!exists);
                reg.createUser(dummyUserJsons["userExistsCheck-1"], function () {
                    reg.userExistsCheck("userExistsCheck-1", function (exists) {
                        assert(exists);
                        done();
                    });
                });
            })
        });
    });

    describe("userExistsCheck-2", function () {
        it("returns false because user doesn't exist", function (done) {
            reg.userExistsCheck("userExistsCheck-2", function (exists) {
                assert(!exists);
                done();
            })
        });
    });
});

