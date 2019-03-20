const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//serve static file
app.use(express.static('./public'))

//log requests to server
app.use(morgan('short'))

//gets details of season from db
app.get('/:prod/S:seasonNum', (req,res) => {

    const prod = req.params.prod
    const seasonNum = req.params.seasonNum

    console.log("Fetching " + prod + " S" + seasonNum)

    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'whiteFoxReadOnly',
        password: 'wfro5463!',
        database: 'whitefoxdb'
    })

    const seasonQuery = "SELECT episodeCount FROM seasons WHERE production = ? AND seasonNumber = ? UNION SELECT title FROM productions WHERE id = ?"

    connection.query(seasonQuery, [prod, seasonNum, prod], (err, rows, fields) => {
        if(err) {
            console.log("Failed to query for season: " + err)
            res.sendStatus(500)
            return
        }
        console.log("I think we fetched the season successfully")
        res.render('seasonDetails',{prod: prod, season: seasonNum, numOfEpisodes: rows[0].episodeCount, title: rows[0].title})
    })

})

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send('Hello. This is the root page.')
})

app.listen(3013, () => {
    console.log("Server is up and listening on 3013")
})