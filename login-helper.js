var db = require('./db-helper.js');

hash = function (password) {
    return password
};

createHash = function (password) {
    return hash(password);
};

//todo implement actual crypto.  This is non-trivial as it cannot be done purely client-side.
passwordIsValid = function (username, password, callback) {
    console.log(`Checking password for user "${username}"`);
    var clientHash = createHash(password);
    console.log(`Hashed ${password} to ${clientHash}`);
    var hashQuery = db.readOnlyConnection.query(`SELECT plainTextPasswordLol FROM users WHERE users.username = "${username}";`, function(err, rows, fields) {
        var serverHash = (rows.length > 0) ? rows[0].plainTextPasswordLol : "";
        var valid = (clientHash === serverHash);
        console.log(`Comparing clientHash=${clientHash} with type ${typeof clientHash} with serverHash=${serverHash} with type ${typeof serverHash} (${valid})`);
        return callback(valid);
    });
};

exports = module.exports = {hash, createHash, passwordIsValid};
