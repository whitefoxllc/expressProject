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
var getIdTitle = function (req, callback) {
    connection.query('SELECT title , id FROM productions ',
        function (err, find, fields) {
            if (err) throw (err);

            return callback(find);

        });
};

var getGenre = function (req, callback) {
    connection.query('SELECT genre FROM genres ',
        function (err, findGenre, fields) {
            if (err) throw (err);

            return callback(findGenre);

        });
};
exports = module.exports ={getIdTitle,getGenre};


