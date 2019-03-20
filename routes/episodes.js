var express = require('express');
var router = express.Router();
var db = require('../db-helper.js');


//gets details of season from db
router.get('/:prod/S:seasonNum', (req,res) => {

    const prod = req.params.prod
    const seasonNum = req.params.seasonNum

    console.log("Fetching " + prod + " S" + seasonNum)
/*
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'whiteFoxReadOnly',
        password: 'wfro5463!',
        database: 'whitefoxdb'
    })
    */

    const seasonQuery = "SELECT episodeCount FROM seasons WHERE production = ? AND seasonNumber = ? UNION SELECT title FROM productions WHERE id = ?"

    db.readOnlyConnection.query(seasonQuery, [prod, seasonNum, prod], (err, rows, fields) => {
        if(err) {
            console.log("Failed to query for season: " + err)
            res.sendStatus(500)
            return
        }
        console.log("I think we fetched the season successfully")
        res.render('episodes',{prod: prod, season: seasonNum, numOfEpisodes: rows[0].episodeCount, title: rows[0].title})
    })

});


router.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send('Hello. This is the root page.')
})

module.exports = router;
