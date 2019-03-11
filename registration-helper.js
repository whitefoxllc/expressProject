var db = require('./db-helper.js');

var userExistsCheck = function(username, callback) {
    console.log(`Checking existence of user ${username}`);
    db.readOnlyConnection.query(`SELECT username FROM users WHERE users.username = "${username}";`, function (err, rows, fields) {
        if (err) throw  err;
        console.log(`result: ${rows.length > 0}`);
        return callback(rows.length > 0);
    });
}

var createUser = function(userJSON, callback) {
    console.log(`creating user with name=${userJSON.username}`)
    db.writeUsersConnection.query(`INSERT INTO users (username, emailaddress, dateCreated, plaintextPasswordLol) VALUES ("${userJSON.username}", "${userJSON.email}", NOW(), "${userJSON.password}");`, function (err, rows, fields) {
    callback();
    });
}



var processUserRegistration = function (req, res, form) {

};

exports = module.exports = {userExistsCheck, createUser, processUserRegistration};
