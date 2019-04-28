const assert  = require('assert');

//login-helper tests
db = require("../db-helper");

after(function (done) {
    console.log("Testing complete - closing db connections!");
    db.coverageRootConnection.end(function () {
        console.log("Connections successfully closed!");
        done();
    });
});

