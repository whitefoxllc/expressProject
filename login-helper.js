var db = require('./db-helper.js');

hash = function (password) {
    return password
};

createHash = function (password) {
    return hash(password);
};

//todo implement actual crypto.  This is non-trivial as it cannot be done purely client-side.
passwordIsValid = function (username, password, callback) {
    var clientHash = createHash(password);
    var hashQuery = db.readOnlyConnection.query(`SELECT plainTextPasswordLol FROM users WHERE users.username = "${username}";`, function(err, rows, fields) {
        if (err) throw err;
        var serverHash = (rows.length > 0) ? rows[0].plainTextPasswordLol : "";
        var valid = (clientHash === serverHash);
        return callback(valid);
    });
};

exports = module.exports = {hash, createHash, passwordIsValid};
