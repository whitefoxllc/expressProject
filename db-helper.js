var mysql = require('mysql');

var readOnlyConnection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb'
});

var writeUsersConnection = mysql.createConnection({
    host: 'localhost',
    user: 'readWriteUsers',
    password: 'wfrwu5463!',
    database: 'whitefoxdb'
});

exports = module.exports = {readOnlyConnection, writeUsersConnection};
