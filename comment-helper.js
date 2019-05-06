var mysql = require('mysql');

var readOnlyConnection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});
var writeDataConnection = mysql.createConnection({
    host: 'localhost',
    user: 'readWriteUsers',
    password: 'wfrwu5463!',
    database: 'whitefoxdb'

});
var reviewRead = function (req, username, callback) {
    var checksql = `SELECT * FROM whitefoxdb.reviews as r join productions as p on p.id=r.production join users as u on u.username=r.user WHERE r.user= '${req.session.user}';`
    console.log(checksql);
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
    var checksql = `SELECT * FROM whitefoxdb.reviews as r join users as u on u.username=r.user where production= '${production}' ORDER BY date DESC;`
    console.log(checksql);
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
                review: row.text,
                displayName: row.displayName
            });
        });
        return callback(theseAreTheRevs);

    });
};
//checks if review is there, if there is send somthing if not send null
var reviewExistCheck = function (username, production, callback){
    console.log(`Checking existence of user ${username}`);
    var checksql = `SELECT user FROM whitefoxdb.reviews WHERE user= '${username}' AND production = '${production}';`
    readOnlyConnection.query(checksql, function (err, rows,fields) {
        if (err) throw err;
        console.log(`result: ${rows.length > 0}`);
        return callback(rows.length > 0);

    });
};

//updating the review
var updateReview = function(username, production, ratingnumber, content, callback){
    console.log('adding the review...\n' + content);
    var sql = `UPDATE whitefoxdb.reviews SET rating = ${ratingnumber}, text = '${content}' WHERE user = '${username}' AND production = '${production}'`
    console.log(sql);
    writeDataConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('review updated');
    });
    callback();
};
//writing the review
var writeReview = function(user, production, ratingnumber, content, callback){
    console.log('adding the review...\n' + content);
    var sql = `INSERT INTO whitefoxdb.reviews (user, production, date, rating, text) VALUES ("${user}", "${production}", NOW(), "${ratingnumber}", "${content}");`
    writeDataConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('review added');
    });
    callback();
};





exports = module.exports = {reviewRead, productionReviews, reviewExistCheck, updateReview, writeReview};