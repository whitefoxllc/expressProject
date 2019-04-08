var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected to database');
})
//Gets production title and ID
var getIdTitle = function (req,callback) {
    connection.query('SELECT title , id FROM productions ',
        function(err,find, fields)
        {
            if (err) throw (err);

           return callback(find);

        });
}
exports = module.exports ={getIdTitle};

 
