const db = require('./db-helper.js');
const dates = require("./date-helper");

var createReview = function (production, rating, text) {
    return {
        production: production,
        rating: rating,
        text: text
    };
};

var updateAverageReviewScore = function (production, callback) {
    console.log(`select avg(rating), count(*) from reviews where production='${production}';`);
    db.readOnlyConnection.query(`select avg(rating) as avg, count(*) as count from reviews where production='${production}';`, function (err, rows, fields) {
        if (err) throw err;
        let ratingAverage = rows[0].avg;
        let ratingCount = rows[0].count;
        db.writeProdsConnection.query(`update productions set ratingAverage='${ratingAverage}', ratingCount='${ratingCount}' where id='${production}';`, function () {
            callback();
        });
    });
};

var submitReview = function (req, reviewJSON, callback) {
    let now = new Date();
    console.log(`insert into reviews values('${req.session.user}','${reviewJSON.production}','${dates.dateToSqlDatetime(now)}','${reviewJSON.rating}','${reviewJSON.text}');`);
    console.log(`delete from reviews where user='${req.session.user}' and production='${reviewJSON.production}';`);
    db.writeUsersConnection.query(`delete from reviews where user='${req.session.user}' and production='${reviewJSON.production}';`, function (err, rows, fields) {
        if (err) throw err;
        db.writeUsersConnection.query(`insert into reviews values('${req.session.user}','${reviewJSON.production}','${dates.dateToSqlDatetime(now)}','${reviewJSON.rating}','${reviewJSON.text}');`, function (err, rows, fields) {
            if (err) throw err;
            updateAverageReviewScore(reviewJSON.production, callback);
        });
    });

};


exports = module.exports = {createReview, submitReview};
