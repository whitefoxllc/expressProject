var db = require('./db-helper.js');





var userExistsCheck = function (req, callback) {
    console.log(`Checking existence of user ${req.session.user}`);
    db.readOnlyConnection.query(`SELECT user FROM userBillingAddresses WHERE user = "${req.session.user}";`, function (err, rows, fields) {
        if (err) throw  err;
        console.log(`result: ${rows.length > 0}`);
        return callback(rows.length > 0);
    });
};

exports = module.exports = {userExistsCheck};
