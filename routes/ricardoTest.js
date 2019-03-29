var router = express.Router();
//var db = require('../helper-db.js');
var mysql = require('mysql');
//var assert = require('assert');
//var util = require('util');
//var app = express();

//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({extended: true});
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



router.get('/', function (req,res) {
    connection.query('SELECT title, id FROM productions ',
        function(err,rows, fields)
        {
            if (err) throw (err);
            var data = [];
            for (i = 0; i< rows.lenght; i++)
            {
                data.push(rows[i].title);
            }
            res.render('ricardoTest',{production_list : rows});
            //res.json(rows);
        });
});


router.get('/search', function (req,res) {
    connection.query('SELECT title FROM productions ',
        //connection.query('SELECT title FROM productions WHERE title LIKE "%'+req.query.key+'%"',
        function(err,rows, fields)
        {
            if (err) throw (err);
            var data = [];
            for (i = 0; i< rows.lenght; i++)
            {
                data.push(rows[i].title);
            }
            //res.json(rows);
            res.end(JSON.stringify(data));
        });
});
router.get('/result', function (req,res) {
    connection.query('SELECT title FROM productions ',
        function(err,rows, fields)
        {
            if (err) throw (err);
            var data = [];
            for (i = 0; i< rows.length; i++)
            {
                data.push(rows[i].title);
            }
            res.json(rows);
        });
});
module.exports= router;
