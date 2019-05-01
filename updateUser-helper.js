var db = require('./db-helper.js');





var userExistsCheck = function (req, callback) {
    db.readOnlyConnection.query(`SELECT user FROM userBillingAddresses WHERE user = "${req.session.user}";`, function (err, rows, fields) {
        if (err) throw  err;
        return callback(rows.length > 0);
    });
};

var ccExistCheck = function(req, callback) {
    db.readOnlyConnection.query(`SELECT user FROM paymentCredentials WHERE user = "${req.session.user}";`, function (err, rows, fields) {
        if (err) throw  err;
        return callback(rows.length > 0);
    });
}
var stateList = function(req, callback) {
    db.readOnlyConnection.query('SELECT state FROM states;', function (err,rows,fields) {
        return callback(rows);

    })
}
exports = module.exports = {userExistsCheck,ccExistCheck,stateList};
