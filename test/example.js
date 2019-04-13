const assert  = require('assert');

//login-helper tests
login = require("../login-helper");

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