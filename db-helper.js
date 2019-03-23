var mysql = require('mysql');

var readOnlyConnection = mysql.createConnection({
    host: 'localhost',
    user: 'whiteFoxReadOnly',
    password: 'wfro5463!',
    database: 'whitefoxdb',
    multipleStatements: true
});

var writeProdsConnection = mysql.createConnection({
    host: 'localhost',
    user: 'readWriteProds',
    password: 'wfp5463!',
    database: 'whitefoxdb'
});

var writeUsersConnection = mysql.createConnection({
    host: 'localhost',
    user: 'readWriteUsers',
    password: 'wfrwu5463!',
    database: 'whitefoxdb'
});

var writeSubscriptionsConnection = mysql.createConnection({
    host: 'localhost',
    user: 'writeSubs',
    password: 'wfs5463!',
    database: 'whitefoxdb'
});

var sessionStoreConnection = mysql.createConnection({
    host: 'localhost',
    user: 'sessionStore',
    password: 'wfss5463!',
    database: 'whitefoxdb'
});



exports = module.exports = {readOnlyConnection, writeProdsConnection, writeUsersConnection, writeSubscriptionsConnection, sessionStoreConnection};
