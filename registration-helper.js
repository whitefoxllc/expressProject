var db = require('./db-helper.js');
var validation = require("./validation-helper");

var userExistsCheck = function (username, callback) {
    if (!validation.isValidUsername(username)) {
        return callback(false);
    }

    db.readOnlyConnection.query(`SELECT username FROM users WHERE users.username = "${username}";`, function (err, rows, fields) {
        if (err) throw  err;
        return callback(rows.length > 0);
    });
};

var createUser = function (userJSON, callback) {
    db.writeUsersConnection.query(`INSERT INTO users (username, displayName, emailaddress, dateCreated, plaintextPasswordLol) VALUES ("${userJSON.username}", "${userJSON.username}", "${userJSON.email}", NOW(), "${userJSON.password}");`, function (err, rows, fields) {
        callback();
    });
};

exports = module.exports = {userExistsCheck, createUser};
