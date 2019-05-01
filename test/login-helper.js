const assert  = require('assert');

//login-helper tests
db = require("../db-helper");
login = require("../login-helper");
reg = require("../registration-helper");

before(function (done) {
    dummyUserJSON = {
        username:"passwordIsValidTestUsername",
        email: "passwordIsValidTestEmail",
        password: "passwordIsValidTestPassword"
    };

    reg.createUser(dummyUserJSON, function () {
        done();
    })
});

after(function (done) {
    db.coverageRootConnection.query(`delete from users where username='passwordIsValidTestUsername';`, function () {
        done();
    });
});

describe("login-helper", function () {

    describe("hash", function () {
        it("returns the hash of a string", function () {
            const hashToCompare = function (password) {
                return password;
            };

            assert.strictEqual(login.hash('testString'), hashToCompare('testString'));
        });
    });

    describe("createHash", function () {
        it("creates a hash", function () {
            assert.strictEqual(login.createHash('testString'), login.hash('testString'));
        });
    });

    describe("passwordIsValid-1", function () {
        it("returns true for a valid username/password", function (done) {
            login.passwordIsValid("passwordIsValidTestUsername", "passwordIsValidTestPassword", function (valid) {
                assert(valid);
                done();
            });
        });
    });

    describe("passwordIsValid-2", function () {
        it("returns false for an  invalid username/password", function (done) {
            login.passwordIsValid("passwordIsValidTestUsername", "notThePassword", function (valid) {
                assert(!valid);
                done();
            });
        });
    });
});

