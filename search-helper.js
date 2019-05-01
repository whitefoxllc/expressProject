var db = require("./db-helper");



//Gets production title and ID
var getAllIdsTitles = function (req, callback) {
    db.readOnlyConnection.query('SELECT title , id FROM productions ',
        function (err, rows, fields) {
            if (err) throw (err);
            return callback(rows);
    });
};

var getAllGenres = function (req, callback) {
    db.readOnlyConnection.query('SELECT genre FROM genres ',
        function (err, genres, fields) {
            if (err) throw (err);
            return callback(genres);
    });
};
exports = module.exports ={getAllIdsTitles,getAllGenres};


