var mysql = require('mysql');

var readOnlyConnection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

readOnlyConnection.connect(function (err) {
    if (err) {
        throw err
    } else {
        return readOnlyConnection;
    }
});

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
    var hashQuery = readOnlyConnection.query(`SELECT plainTextPasswordLol FROM users WHERE users.username = "${username}";`, function(err, rows, fields) {
        var serverHash = (rows.length > 0) ? rows[0].plainTextPasswordLol : "";
        var valid = (clientHash === serverHash);
        console.log(`Comparing clientHash=${clientHash} with type ${typeof clientHash} with serverHash=${serverHash} with type ${typeof serverHash} (${valid})`);
        return callback(valid);
    });
};

exports = module.exports = {hash, createHash, passwordIsValid};
