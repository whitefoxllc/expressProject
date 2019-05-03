var mysql = require('mysql');

var readOnlyConnection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

var reviewRead = function (req, username, callback) {
    var checksql = `SELECT * FROM whitefoxdb.reviews as r join productions as p on p.id=r.production WHERE r.user= '${req.session.user}';`
    console.log(req.session.user);
    readOnlyConnection.query(checksql, function (err, row, field) {
        if (err)throw err;
        var theseAreTheRevs = [];
        var count = 0;
        row.forEach(function (row) {
            theseAreTheRevs.push({user: row.user,
                production:row.title,
                date: row.date,
                rating: row.rating,
                review: row.text});
        });
        return callback(theseAreTheRevs);

    });
};
var productionReviews = function (req, production, callback) {
    var checksql = `SELECT * FROM whitefoxdb.reviews where production= '${production}' ORDER BY date DESC;`
    console.log(production);
    readOnlyConnection.query(checksql, function (err, row, field) {
        if (err)throw err;
        var theseAreTheRevs = [];
        var count = 0;
        row.forEach(function (row) {
            theseAreTheRevs.push({
                user: row.user,
                production:row.title,
                date: row.date,
                rating: row.rating,
                review: row.text});
        });
        return callback(theseAreTheRevs);

    });
};
exports = module.exports = {reviewRead, productionReviews};