const assert  = require('assert');

val = require("../validation-helper");


describe("validation-helper", function () {

    describe("isValidUsername-1", function () {
        it("returns true because input is only alphanumeric, dash or underscore", function () {
            assert(val.isValidUsername("testString123-_"));
        });
    });

    describe("isValidUsername-2", function () {
        it("returns false because input contains a special character", function () {
            assert(!val.isValidUsername("testString123-_;"));
        });
    });

    describe("isValidUsername-3", function () {
        it("returns false because input is null", function () {
            assert(!val.isValidUsername(""));
        });
    });

});


