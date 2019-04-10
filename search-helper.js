var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('You are now connected to database');
});

//Gets production title and ID
var getAllIdsTitles = function (req, callback) {
    connection.query('SELECT title , id FROM productions ',
        function (err, rows, fields) {
            if (err) throw (err);

            return callback(rows);

        });
};

var getAllGenres = function (req, callback) {
    connection.query('SELECT genre FROM genres ',
        function (err, genres, fields) {
            if (err) throw (err);

            return callback(genres);

        });
};
exports = module.exports ={getAllIdsTitles,getAllGenres};


